import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { StorageFile } from 'src/database/entities/storage-file.entity';
import { AbstractRepository } from 'src/database/repositories/abstract.repository';

@DatabaseRepository(StorageFile)
export class StorageFileRepository extends AbstractRepository<StorageFile> {}
