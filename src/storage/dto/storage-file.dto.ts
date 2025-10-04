import { StringField } from '@skull/core/decorators';
import { StorageFile } from 'src/database/entities/storage-file.entity';
import { StorageService } from '../services/storage.service';

export class StorageFileDto {
  @StringField()
  filePath: string;

  @StringField()
  imageUrl: string;

  constructor(storageFile?: StorageFile) {
    if (storageFile == null) {
      return;
    }

    this.filePath = storageFile.filePath;
  }

  static async toDto(storageFile?: StorageFile, storageService?: StorageService) {
    const dto = new StorageFileDto(storageFile);

    if (storageFile && storageService) {
      dto.imageUrl = await storageService.get(storageFile.bucketName, storageFile.filePath);
    }

    return dto;
  }
}
