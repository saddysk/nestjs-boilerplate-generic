import { merge } from 'lodash';
import { AppConfig } from 'src/config/config';
import * as winston from 'winston';
import { logLevelColors, logLevels, WinstonLogger } from './winston-logger';

const CONFIG = AppConfig();

function defaultConfig(): winston.LoggerOptions {
  const formats = [];

  if (CONFIG.APP_ENV === 'local') {
    formats.push(
      winston.format.colorize({
        level: true,
        colors: logLevelColors,
      })
    );
  }

  formats.push(
    winston.format.timestamp({
      format: 'YYYY-MM-DDTHH:mm:ss.SSSSZZ',
    }),
    winston.format.printf((info: any) => {
      return `${info.timestamp} [${info.level}] [${info.context ?? '-'}] - ${info.message}${
        info.status ? ' - <status:' + info.status + '>' : ''
      }${info.stack ? '\n<stack> ' + info.stack + ' ' : ''}`;
    })
  );

  return {
    level: 'debug',
    levels: logLevels,
    format: winston.format.combine(...formats),
    transports: [new winston.transports.Console()],
  };
}

export function logger(options?: winston.LoggerOptions) {
  return new WinstonLogger(winston.createLogger(merge(defaultConfig(), options)));
}
