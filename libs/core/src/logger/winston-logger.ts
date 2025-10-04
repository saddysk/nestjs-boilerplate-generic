/* eslint @typescript-eslint/explicit-module-boundary-types: 'off' */
import { Logger } from 'winston';
import { LoggerService } from '@nestjs/common';

export declare type LogLevel =
  // | 'log'
  'emerg' | 'alert' | 'crit' | 'error' | 'warn' | 'notice' | 'info' | 'debug' | 'verbose';

// severity ordering specified by RFC5424: severity of all levels is assumed to be numerically ascending from most important to least important.
// emerg: 0,
// alert: 1,
// crit: 2,
// error: 3,
// warning: 4,
// notice: 5,
// info: 6,
// debug: 7,
// verbose: 8

// For error codes
// 0       Emergency: system is unusable
// 1       Alert: action must be taken immediately
// 2       Critical: critical conditions
// 3       Error: error conditions
// 4       Warning: warning conditions
// 5       Notice: normal but significant condition
// 6       Informational: informational messages
// 7       Debug: debug-level messages

export const logLevels: Record<LogLevel, number> = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warn: 4,
  notice: 5,
  info: 6,
  debug: 7,
  verbose: 8,
};

export const logLevelColors: Record<LogLevel, string> = {
  emerg: 'red',
  alert: 'red',
  crit: 'red',
  error: 'red',
  warn: 'yellow',
  notice: 'yellow',
  info: 'green',
  debug: 'grey',
  verbose: 'cyan',
};

export class WinstonLogger implements LoggerService {
  private context?: string;

  constructor(private readonly logger: Logger) {}

  public setContext(context: string) {
    this.context = context;
  }

  public emerg(message: any, trace?: string, context?: string): any {
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return this.logger.emerg(msg, { context, stack: [trace || message.stack], error: message, ...meta });
    }

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.emerg(msg as string, { context, stack: [trace], ...meta });
    }

    return this.logger.emerg(message, { context, stack: [trace] });
  }

  public alert(message: any, trace?: string, context?: string): any {
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return this.logger.alert(msg, { context, stack: [trace || message.stack], error: message, ...meta });
    }

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.alert(msg as string, { context, stack: [trace], ...meta });
    }

    return this.logger.alert(message, { context, stack: [trace] });
  }

  public crit(message: any, trace?: string, context?: string): any {
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return this.logger.crit(msg, { context, stack: [trace || message.stack], error: message, ...meta });
    }

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.crit(msg as string, { context, stack: [trace], ...meta });
    }

    return this.logger.crit(message, { context, stack: [trace] });
  }

  public error(message: any, trace?: string, context?: string): any {
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return this.logger.error(msg, { context, stack: [trace || message.stack], error: message, ...meta });
    }

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.error(msg as string, { context, stack: [trace], ...meta });
    }

    return this.logger.error(message, { context, stack: [trace] });
  }

  public warn(message: any, context?: string): any {
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.warn(msg as string, { context, ...meta });
    }

    return this.logger.warn(message, { context });
  }

  public notice?(message: any, context?: string): any {
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.notice(msg as string, { context, ...meta });
    }

    return this.logger.notice(message, { context });
  }

  public log(message: any, context?: string): any {
    context = context || this.context;
    const level = message.level ?? 'info';

    if (!!message && 'object' === typeof message) {
      switch (level) {
        case 'emerg':
        case 'emergency':
          return this.emerg(message, null, context);
        case 'alert':
          return this.alert(message, null, context);
        case 'crit':
        case 'critical':
          return this.crit(message, null, context);
        case 'error':
          return this.error(message, null, context);
        case 'warning':
          return this.warn(message, context);
        case 'notice':
          return this.notice(message, context);
        case 'debug':
          return this.debug(message, context);
        case 'info':
          const { message: msg, ...meta } = message;
          return this.logger.log(level, msg as string, { context, ...meta });
        default:
          this.logger.warn(`Invalid log level "${level}" supplied.`);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { message: _msg, ..._meta } = message;
          return this.logger.log('info', _msg as string, { context, ..._meta });
      }
    }

    return this.logger.info(message, { context });
  }

  public debug?(message: any, context?: string): any {
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.debug(msg as string, { context, ...meta });
    }

    return this.logger.debug(message, { context });
  }

  public verbose?(message: any, context?: string): any {
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.verbose(msg as string, { context, ...meta });
    }

    return this.logger.verbose(message, { context });
  }

  public getWinstonLogger(): Logger {
    return this.logger;
  }
}
