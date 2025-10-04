import { Column, Entity } from 'typeorm';
import { AbstractSoftEntity } from './abstract-soft.entity';
import { StorageFileTypes } from 'src/storage/services/storage.service';

@Entity()
export class StorageFile extends AbstractSoftEntity {
  @Column({ type: 'varchar' })
  bucketName: StorageFileTypes;

  @Column()
  filePath: string;
}
