import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';
import { Request } from 'express';
import { isString } from 'lodash';
import { AppConfig } from 'src/config/config';
import { EntityNotFoundError } from 'typeorm';

const CONFIG = AppConfig();

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      Logger.error(exception, null, AllExceptionsFilter.name);
      throw exception;
    }

    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();

    if (exception instanceof ConflictException) {
      Logger.warn(exception, AllExceptionsFilter.name);
    } else if (exception instanceof ThrottlerException) {
      Logger.warn(
        `ThrottlerException: Too Many Requests. path: ${req.path} hostname: ${req.hostname}`,
        AllExceptionsFilter.name
      );
    } else if (
      !(exception instanceof ForbiddenException) &&
      !(exception instanceof UnauthorizedException) &&
      !(exception instanceof NotFoundException)
    ) {
      Logger.error(exception, null, AllExceptionsFilter.name);
    }

    let statusCode = 500;
    let response = null;
    let _exception = null;
    if (exception instanceof HttpException) {
      response = exception.getResponse() as {
        key: string;
        args: Record<string, unknown>;
      };
      statusCode = exception.getStatus();
    } else if (exception instanceof EntityNotFoundError) {
      response = {
        error: (exception as any).statusCode ?? 'Not found',
        message: `${(exception as EntityNotFoundError).name} entity is not found.`,
      };

      _exception = exception;
      statusCode = (exception as any).statusCode ?? HttpStatus.NOT_FOUND;
    } else {
      response = {
        error: (exception as any).statusCode ?? 'Internal server error',
        message: (exception as any).message,
      };

      _exception = exception;
      statusCode = (exception as any).statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    }

    if (response['error'] == null && isString(response['message'])) {
      response['error'] = response['message'];
    }

    httpAdapter.reply(
      ctx.getResponse(),
      {
        statusCode,
        error: 'Internal server error',
        ...response,
        _exception:
          CONFIG.APP_ENV === 'development' ||
          CONFIG.APP_ENV === 'local' ||
          CONFIG.APP_ENV === 'ci' ||
          CONFIG.APP_ENV === 'preview'
            ? _exception
            : undefined,
      },
      statusCode
    );
  }
}
