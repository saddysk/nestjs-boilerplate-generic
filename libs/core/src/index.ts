import { LogLevel } from './logger/winston-logger';

export * from './core.module';
export * from './core.service';
export * from './logger/logger';
export * from './logger/winston-logger';

declare module '@nestjs/common' {
  export interface LoggerService {
    /**
     * Write an 'emerg' level log.
     */
    emerg(message: any, ...optionalParams: any[]): any;

    /**
     * Write an 'alert' level log.
     */
    alert(message: any, ...optionalParams: any[]): any;

    /**
     * Write an 'crit' level log.
     */
    crit(message: any, ...optionalParams: any[]): any;

    /**
     * Write an 'notice' level log.
     */
    notice?(message: any, ...optionalParams: any[]): any;

    /**
     * Write a any level log default 'info'.
     */
    log<T extends { level: LogLevel; message: string; error?: Error; [key: string]: any }>(
      message: T,
      ...optionalParams: any[]
    ): any;
  }
}
