import 'reflect-metadata';
import './boilerplate.polyfill';
import { CommandFactory } from 'nest-commander';
import { logger } from '@skull/core/logger/logger';

import { ConsoleModule } from './console.module';

async function bootstrap() {
  await CommandFactory.run(ConsoleModule, {
    logger: logger(),
  });
}

bootstrap();
