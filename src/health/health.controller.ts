import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { GetRoute } from '@skull/core/decorators/route.decorators';
import { HealthService } from './health.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('api/health')
@ApiTags('Health Check')
export class HealthController {
  constructor(private readonly health: HealthCheckService, private readonly healthService: HealthService) {}

  @GetRoute('liveness', {
    isPublic: true,
  })
  @HealthCheck()
  @SkipThrottle()
  liveness() {
    return this.health.check([this.healthService.version]);
  }

  @GetRoute('readiness', {
    isPublic: true,
  })
  @HealthCheck()
  readiness() {
    return this.check();
  }

  @GetRoute('', {
    isPublic: true,
  })
  @HealthCheck()
  async check() {
    const result = await this.health.check([
      this.healthService.database,
      this.healthService.memoryHeap,
      this.healthService.version,
    ]);

    if (result.status === 'error') {
      Logger.log(
        {
          level: 'crit',
          message: `Health check failed. ${result.info}}`,
        },
        null,
        HealthController.name
      );
    }

    return result;
  }

  @GetRoute('database', {
    isPublic: true,
  })
  @HealthCheck()
  database() {
    return this.healthService.database();
  }
}
