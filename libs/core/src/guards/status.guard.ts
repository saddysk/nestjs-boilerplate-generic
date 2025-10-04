import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAuthUser } from '../interfaces/auth-user.interface';
import { StatusSymbol } from '../decorators/auth.decorators';

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const statues = this.reflector.getAllAndOverride<string[] | null>(StatusSymbol, [
      context.getHandler(),
      context.getClass(),
    ]);

    const noStatus = statues == null || statues.length === 0;

    const request = context.switchToHttp().getRequest();
    const user = <IAuthUser>request.user;

    if (user == null) {
      return true;
    }

    if ((noStatus && user.status !== 'active') || (!noStatus && !statues.includes(user.status))) {
      throw new ForbiddenException(`Invalid user status.`);
    }

    return true;
  }
}
