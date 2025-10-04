import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isEmpty } from 'lodash';
import { RoleSymbol } from '../decorators/auth.decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[] | null>(RoleSymbol, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isEmpty(roles)) {
      return true;
    }

    // TODO: implement role and permission
    // const request = context.switchToHttp().getRequest();
    // const user = <IAuthUser>request.user;

    // if (user.role === 'superadmin') {
    //   return true;
    // }

    // return roles.includes(user.role);

    return true;
  }
}
