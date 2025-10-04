import { Injectable, Logger } from '@nestjs/common';
import { StorageFileRepository } from '../repositories/storage-file.repository';
import { StorageFileTypes, StorageService } from './storage.service';
import path from 'path';
import { uuid } from '@skull/core/helpers/generator.helper';
import { StorageFile } from 'src/database/entities/storage-file.entity';

@Injectable()
export class StorageFileService {
  constructor(
    private readonly storageFileRepository: StorageFileRepository,
    private readonly storageService: StorageService
  ) {}

  async save(fileType: StorageFileTypes, file: Express.Multer.File): Promise<StorageFile> {
    const filePath = `${uuid()}${path.extname(file.originalname)}`;

    await this.storageService.store(fileType, filePath, file.buffer, {
      mimetype: file.mimetype,
    });

    const storageFile = new StorageFile();

    storageFile.bucketName = fileType;
    storageFile.filePath = filePath;

    return this.storageFileRepository.save(storageFile, { reload: true });
  }

  async delete(bucketName: StorageFileTypes, filePath: string) {
    const fileStorage = await this.storageFileRepository.findOne({
      where: {
        bucketName,
        filePath,
      },
    });

    if (!fileStorage) {
      Logger.debug(
        `Image file does not exist in the table to be deleted, image: ${filePath}`,
        StorageFileService.name
      );
      return;
    }

    return this.storageFileRepository.remove(fileStorage);
  }
}
