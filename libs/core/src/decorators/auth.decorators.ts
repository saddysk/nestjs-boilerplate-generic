import { IAuthGuardOptions } from './../guards/auth.guard';
import { applyDecorators, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PublicRoute } from './public-route.decorator';
// TODO: implement role and permission
// import { PermissionGuard } from '../guards/permission.guard';
// import { RoleGuard } from '../guards/role.guard';
// import { StatusGuard } from '../guards/status.guard';

export const PermissionsSymbol = 'permissions';
export const RoleSymbol = 'userRole';
export const StatusSymbol = 'userStatus';

export const Permissions = (...permissions: string[]) => SetMetadata(PermissionsSymbol, permissions);
export const Roles = (...types: string[]) => SetMetadata(RoleSymbol, types);
export const Statues = (...statuses: string[]) => SetMetadata(StatusSymbol, statuses);

export interface IAuthOptions extends IAuthGuardOptions {
  checkCaptcha?: boolean;
}

export function Auth(
  permissions?: string[],
  userTypes?: string[],
  options?: Partial<IAuthOptions>
): MethodDecorator {
  const authGuardOptions = options ?? {};

  const gaurds: any[] = [];

  // if (!authGuardOptions?.isPublic) {
  //   gaurds.push(StatusGuard, RoleGuard, PermissionGuard);
  // }

  const decorators: MethodDecorator[] = [
    UseGuards(AuthGuard(authGuardOptions), ...gaurds),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    PublicRoute(authGuardOptions?.isPublic),
  ];

  if (permissions != null) {
    decorators.push(Permissions(...permissions));
  }

  if (userTypes != null) {
    decorators.push(Roles(...userTypes));
  }

  return applyDecorators(...decorators);
}
