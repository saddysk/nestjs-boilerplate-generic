import { StringField, DateFieldOptional } from '@skull/core/decorators';

type BaseDtoInterface = BaseDto;

export class BaseDto {
  @StringField()
  id: string;

  @DateFieldOptional()
  createdAt?: Date;

  @DateFieldOptional()
  updatedAt?: Date;

  constructor(entity?: Partial<BaseDtoInterface>) {
    if (entity == null) {
      return;
    }

    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
