// import MemoryStore from 'cache-manager-memory-store';
import { CacheModule, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    CacheModule.register({
      isGlobal: true,
      // store: MemoryStore,
    }),
  ],
})
export class BaseModule {}
