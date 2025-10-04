import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Request } from 'express';
import { last, split, trim } from 'lodash';
import { createHash } from 'crypto';
import { PUBLIC_ROUTE_KEY } from '@skull/core/decorators/public-route.decorator';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  constructor(
    @InjectThrottlerOptions() protected readonly options: ThrottlerModuleOptions,
    @InjectThrottlerStorage() protected readonly storageService: ThrottlerStorage,
    protected readonly reflector: Reflector
  ) {
    super(options, storageService, reflector);
  }

  /**
   * Throttle requests against their TTL limit and whether to allow or deny it.
   * Based on the context type different handlers will be called.
   * @throws {ThrottlerException}
   */
  canActivate(context: ExecutionContext): Promise<boolean> {
    const contextType = context.getType();

    // Only throttle HTTP requests
    if (contextType !== 'http') {
      return Promise.resolve(true);
    }

    return super.canActivate(context);
  }

  /**
   * Throttles incoming HTTP requests.
   * All the outgoing requests will contain RFC-compatible RateLimit headers.
   * @see https://tools.ietf.org/id/draft-polli-ratelimit-headers-00.html#header-specifications
   * @throws {ThrottlerException}
   */
  protected async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
    // Here we start to check the amount of requests being done against the ttl.
    const { req, res } = this.getRequestResponse(context);

    // Return early if the current user agent should be ignored.
    if (Array.isArray(this.options.ignoreUserAgents)) {
      for (const pattern of this.options.ignoreUserAgents) {
        if (pattern.test(req.headers['user-agent'])) {
          return true;
        }
      }
    }

    const handler = context.getHandler();
    const classRef = context.getClass();

    // Until TODO is not implemented we will use ip as tracker for public endpoints
    const isPublicRoute = this.reflector.getAllAndOverride<number>(PUBLIC_ROUTE_KEY, [handler, classRef]);
    const tracker = !!isPublicRoute ? this.getIpTracker(req) : this.getTracker(req);

    const key = this.generateKey(context, tracker);
    const { totalHits, timeToExpire } = await this.storageService.increment(key, ttl);

    // Throw an error when the user reached their limit.
    if (totalHits > limit) {
      res.header('Retry-After', timeToExpire);
      this.throwThrottlingException(context);
    }

    res.header(`${this.headerPrefix}-Limit`, limit);
    // We're about to add a record so we need to take that into account here.
    // Otherwise the header says we have a request left when there are none.
    res.header(`${this.headerPrefix}-Remaining`, Math.max(0, limit - totalHits));
    res.header(`${this.headerPrefix}-Reset`, timeToExpire);

    return true;
  }

  protected getTracker(req: Record<string, any>): string {
    const request = req as unknown as Request;

    if (!request?.headers?.authorization) {
      return this.getIpTracker(req);
    }
    // If request has authentication token then use token as tracker instead of IP
    // TODO: If we are using auth token as tracker then
    // we should verify token before using it as tracker

    const authorization = last(split(trim(request.headers.authorization)));
    return createHash('md5').update(authorization).digest('hex');
  }

  protected getIpTracker(req: Record<string, any>): string {
    const request = req as unknown as Request;
    const ip = (request.headers['cf-connecting-ip'] ?? request.ip) as string;

    return createHash('md5').update(ip).digest('hex');
  }
}
