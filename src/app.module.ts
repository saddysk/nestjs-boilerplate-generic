import { HttpException, Module } from '@nestjs/common';
import { BaseModule } from './base.module';
import { HealthModule } from './health/health.module';
import { AppConfig } from './config/config';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimitGuard } from './common/gaurds/rate-limit.guard';
import { AuthModule } from './auth/auth.module';

const CONFIG = AppConfig();

const devModules = [];
// Prevent test module on docker images
// if (process.env.NODE_ENV === 'development' && process.env.APP_VERSION == null) {
// }

const extraModules = [];
if (CONFIG.SENTRY_DSN) {
  extraModules.push(
    SentryModule.forRoot({
      dsn: CONFIG.SENTRY_DSN,
      debug: false,
      environment: CONFIG.APP_ENV,
      release: CONFIG.APP_VERSION,
      logLevels: ['error'],
    })
  );
}

@Module({
  imports: [
    ...devModules,
    ...extraModules,
    ThrottlerModule.forRoot({
      ttl: CONFIG.THROTTLE_TTL,
      limit: CONFIG.THROTTLE_LIMIT,
    }),
    BaseModule,
    HealthModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exception: HttpException) => 500 > exception.getStatus(), // Only report 500 errors
            },
          ],
        }),
    },
  ],
})
export class AppModule {}
