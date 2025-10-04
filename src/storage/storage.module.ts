import { Module } from '@nestjs/common';
import { StorageModule as NestjsStorageModule, DriverType } from '@codebrew/nestjs-storage';
import path from 'path';
import { AppConfig } from '../config/config';
import { StorageService } from 'src/storage/services/storage.service';
import { DatabaseModule } from 'src/database/database.module';
import { StorageFileRepository } from './repositories/storage-file.repository';
import { StorageFileService } from './services/storage-file.service';
import { StorageFileController } from './storage-file.controller';

const CONFIG = AppConfig();

@Module({
  imports: [
    NestjsStorageModule.forRoot({
      default: 's3',
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: {
            root: path.join(process.cwd(), 'docker-data/local-storage'),
          },
        },
        s3: {
          driver: DriverType.S3,
          config: {
            key: CONFIG.S3_KEY,
            endpoint: CONFIG.S3_ENDPOINT,
            secret: CONFIG.S3_SECRET,
            bucket: CONFIG.S3_BUCKET,
            region: CONFIG.S3_REGION,
          },
        },
      },
    }),
    DatabaseModule.forRepository([StorageFileRepository]),
  ],
  controllers: [StorageFileController],
  providers: [StorageService, StorageFileService],
  exports: [StorageService, StorageFileService],
})
export class StorageModule {}
