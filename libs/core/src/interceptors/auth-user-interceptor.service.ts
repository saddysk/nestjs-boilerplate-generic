import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IAuthUser } from '../interfaces/auth-user.interface';
import { AuthUser } from '../providers/auth-context.provider';
import * as Sentry from '@sentry/node';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const user = <IAuthUser>request.user;
    AuthUser.setUser(user);

    if (user) {
      try {
        Sentry.setUser({ email: user.email, id: user.id });
      } catch (error) {
        Logger.error(error, null, 'Sentry');
      }
    }

    return next.handle();
  }
}
