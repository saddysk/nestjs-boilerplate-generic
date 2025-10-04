import 'reflect-metadata';
import './boilerplate.polyfill';
import { AppConfig } from './config/config';

if (process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { middleware as expressCtx } from 'express-ctx';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { logger } from '@skull/core/logger/logger';
import { useContainer } from 'class-validator';
import { ValidationExceptionFilter } from '@skull/core/filters/validation-exception.filter';
// import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { setupSwagger } from '@skull/core/swagger/setup';
// import { each } from 'lodash';
import { AllExceptionsFilter } from '@skull/core/filters/all-exceptions.filter';
const CONFIG = AppConfig();

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    rawBody: true,
    bodyParser: true,
    cors: CONFIG.CORS,
    logger: logger({
      level: CONFIG.LOG_LEVEL,
    }),
  });

  // enable DI for class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.disable('x-powered-by');

  app.useBodyParser('json', { limit: '101mb' });
  app.useBodyParser('text', { limit: '10mb' });
  app.useBodyParser('urlencoded', { limit: '101mb', extended: true });

  // app.enable('trust proxy', CONFIG.PROXY_DEPTH); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

  const reflector = app.get(Reflector);

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalFilters(new ValidationExceptionFilter(reflector));
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (CONFIG.SWAGGER_ENABLED) {
    await setupSwagger(app, CONFIG.APP_VERSION);
  }

  app.use(expressCtx);

  // Starts listening for shutdown hooks
  // if (!configService.isDevelopment) {
  //   app.enableShutdownHooks();
  // }

  await app.listen(CONFIG.PORT, CONFIG.HOST);

  Logger.log(`Server running on ${await app.getUrl()}`);

  return app;
}

void bootstrap();
