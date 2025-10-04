import { BadRequestException, Controller, Param, UploadedFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiFile } from '@skull/core/decorators';
import { PostRoute } from '@skull/core/decorators/route.decorators';
import { StorageFileService } from './services/storage-file.service';
import { StorageFileTypes, StorageService } from './services/storage.service';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { validateFile, hasExtension } from '@skull/core/helpers/validation.helper';
import { StorageFileDto } from './dto/storage-file.dto';

function imageAttachmentMulterOptions(): MulterOptions {
  return {
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: validateFile([hasExtension(['jpg', 'jpeg', 'png', 'svg'])]),
  };
}

@Controller('api/v1/storage/files')
@ApiTags('Storage Files')
export class StorageFileController {
  constructor(
    private readonly storageFileService: StorageFileService,
    private readonly storageService: StorageService
  ) {}

  @PostRoute(':storageType', {
    Ok: StorageFileDto,
    isBearer: true,
  })
  @ApiFile([{ name: 'image' }], imageAttachmentMulterOptions())
  async post(
    @Param('storageType') storageType: StorageFileTypes,
    @UploadedFile() file: Express.Multer.File
  ): Promise<StorageFileDto> {
    const acceptedStorageFileTypes: StorageFileTypes[] = Object.values(StorageFileTypes).filter(
      (t) => t === StorageFileTypes.PRODUCTS
    );
    if (!acceptedStorageFileTypes.includes(storageType)) {
      throw new BadRequestException(`Invalid storage type. Accepted: ${acceptedStorageFileTypes.join(', ')}`);
    }

    const storageFile = await this.storageFileService.save(storageType, file);
    return StorageFileDto.toDto(storageFile, this.storageService);
  }
}
