import type { IAuthGuard, Type } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export interface IAuthGuardOptions {
  isPublic?: boolean;
  isBearer?: boolean;
  isInternal?: boolean;
}

export function AuthGuard(options?: Partial<IAuthGuardOptions>): Type<IAuthGuard> {
  let strategies = ['jwt'];

  if (options?.isBearer) {
    strategies.push('bearer');
  }

  if (options?.isPublic) {
    strategies.push('public');
  }

  if (options?.isInternal) {
    // if internal then no other strategy should be active
    strategies = ['internal'];
  }

  return NestAuthGuard(strategies);
}
