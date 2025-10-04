import path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { StorageService as NestStorageService } from '@codebrew/nestjs-storage';
import { AmazonWebServicesS3Storage } from '@slynova/flydrive-s3';
import { uuid } from '@skull/core/helpers/generator.helper';
import { SignedUrlOptions } from '@slynova/flydrive';
// import { createClient } from '@supabase/supabase-js';
// import StorageFileApi from '@supabase/storage-js/dist/module/packages/StorageFileApi';

export enum StorageFileTypes {
  BRAND_LOGO = 'brand-logo',
  PAYMENT_RECEIPTS = 'payment-receipts',
  INVOICES = 'invoices',
  PRODUCTS = 'products',
}

@Injectable()
export class StorageService {
  private readonly disk: AmazonWebServicesS3Storage;
  // private readonly supabasePublic: StorageFileApi;

  constructor(private storage: NestStorageService) {
    if (this.disk === undefined) {
      this.storage.registerDriver('s3', AmazonWebServicesS3Storage);
      this.disk = this.storage.getDisk<AmazonWebServicesS3Storage>();
    }

    // this.supabasePublic = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY).storage.from(
    //   CONFIG.SUPABASE_BUCKET
    // );
  }

  async store(
    type: StorageFileTypes,
    fileName: string,
    file: Buffer,
    options?: {
      mimetype?: string;
      upsert?: boolean;
    }
  ): Promise<string> {
    const filePath = `${type}/${fileName}`;

    // Use supabase for brand logo & product image
    if (type === StorageFileTypes.BRAND_LOGO || type === StorageFileTypes.PRODUCTS) {
      // const { error } = await this.supabasePublic.upload(filePath, file, {
      //   contentType: options?.mimetype,
      //   upsert: options?.upsert ?? true,
      // });

      // if (error !== null) {
      //   Logger.error(error, null, StorageService.name);
      //   throw new BadRequestException('Failed to upload image file.');
      // }

      Logger.warn('Supabase storage not implemented');
    } else {
      await this.storage.getDisk().put(filePath, file);
    }

    return fileName;
  }

  async put(type: StorageFileTypes, file: Express.Multer.File): Promise<string> {
    const fileName = uuid() + path.extname(file.originalname);
    const filePath = `${type}/${fileName}`;

    // Use supabase for brand logo & product image
    if (type === StorageFileTypes.BRAND_LOGO || type === StorageFileTypes.PRODUCTS) {
      // const { error } = await this.supabasePublic.upload(filePath, file.buffer, {
      //   contentType: file.mimetype,
      //   upsert: true,
      // });

      // if (error !== null) {
      //   Logger.error(error, null, StorageService.name);
      //   throw new BadRequestException('Failed to upload image file.');
      // }

      Logger.warn('Supabase storage not implemented');
    } else {
      await this.storage.getDisk().put(filePath, file.buffer);
    }

    return fileName;
  }

  async get(type: StorageFileTypes, fileName: string, options?: SignedUrlOptions): Promise<string> {
    const path = `${type}/${fileName}`;

    let fileUrl = null;

    // Use supabase for brand logo & product image
    if (type === StorageFileTypes.BRAND_LOGO || type === StorageFileTypes.PRODUCTS) {
      // const { data } = this.supabasePublic.getPublicUrl(path);
      // fileUrl = data.publicUrl + `?t=${Date.now()}`;

      Logger.warn('Supabase storage not implemented');
    } else {
      const { signedUrl } = await this.storage.getDisk().getSignedUrl(path, options);
      fileUrl = signedUrl;
    }

    return fileUrl;
  }

  async delete(type: StorageFileTypes, fileName: string): Promise<string> {
    // const path = `${type}/${fileName}`;

    // Use supabase for brand logo
    if (type === StorageFileTypes.BRAND_LOGO) {
      // const { error } = await this.supabasePublic.remove([path]);
      // if (error !== null) {
      //   Logger.error(error, null, StorageService.name);
      //   throw new BadRequestException('Failed to delete image file.');
      // }

      Logger.warn('Supabase storage not implemented');
    }

    return fileName;
  }
}
