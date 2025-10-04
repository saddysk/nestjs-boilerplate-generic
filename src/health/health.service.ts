import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { AppConfig } from 'src/config/config';

const CONFIG = AppConfig();

@Injectable()
export class HealthService {
  constructor(
    private readonly memory: MemoryHealthIndicator,
    private readonly typeorm: TypeOrmHealthIndicator
  ) {}

  readonly database = () => {
    return this.typeorm.pingCheck('database', { timeout: CONFIG.HEALTH_DB_TIMEOUT });
  };

  readonly memoryHeap = () => {
    return this.memory.checkHeap('memory_heap', CONFIG.HEALTH_MEMORY_HEAP_THRESHOLD);
  };

  readonly version = () => {
    return Promise.resolve<HealthIndicatorResult>({
      version: {
        status: 'up',
        api: CONFIG.APP_VERSION,
      },
    });
  };
}
