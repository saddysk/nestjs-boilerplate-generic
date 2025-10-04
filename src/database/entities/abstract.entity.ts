import { AuthUser } from '@skull/core/providers/auth-context.provider';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { OmitByValue, PickByValue } from 'utility-types';

export abstract class AbstractEntity implements IAbstractEntity<string> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy?: string;

  // @ManyToOne(() => UserEntity, (user) => user.id)
  // @JoinColumn({
  //   name: 'createdBy',
  // })
  // createdByUser?: Promise<UserEntity>;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  // @ManyToOne(() => UserEntity, (user) => user.id)
  // @JoinColumn({
  //   name: 'updatedBy',
  // })
  // updatedByUser?: Promise<UserEntity>;

  @BeforeInsert()
  updateCreatedBy() {
    const authUser = AuthUser.user();
    this.createdBy = authUser ? authUser.id : null;
    this.updatedBy = authUser ? authUser.id : null;
  }

  @BeforeUpdate()
  updateUpdatedBy() {
    const authUser = AuthUser.user();
    if (authUser) {
      this.updatedBy = authUser.id;
    }
  }
}

export interface IAbstractEntity<TId = string> {
  id: TId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAbstractSoftEntity<TId = string> extends IAbstractEntity<TId> {
  deletedAt?: Date;
}

export type IMetadata = Record<string, string | number | boolean | string[] | number[]>;

export type EntityWithoutRelations<T extends AbstractEntity> = OmitByValue<
  T,
  AbstractEntity | AbstractEntity[] | Promise<AbstractEntity> | Promise<AbstractEntity[]>
>;

export type EntityWithoutRelationsExcept<
  T extends AbstractEntity,
  TPickedRelations extends keyof PickByValue<
    T,
    AbstractEntity | AbstractEntity[] | Promise<AbstractEntity> | Promise<AbstractEntity[]>
  >
> = OmitByValue<
  T,
  AbstractEntity | AbstractEntity[] | Promise<AbstractEntity> | Promise<AbstractEntity[]>
> & {
  [P in TPickedRelations]: T[P] extends AbstractEntity
    ? EntityWithoutRelations<T[P]>
    : T[P] extends AbstractEntity[]
    ? Array<EntityWithoutRelations<T[P][number]>>
    : T[P] extends Promise<AbstractEntity>
    ? Promise<EntityWithoutRelations<Awaited<T[P]>>>
    : T[P] extends Promise<AbstractEntity[]>
    ? Promise<Array<EntityWithoutRelations<Awaited<T[P]>[number]>>>
    : never;
};

export type EntityWithOnlyRelations<T extends AbstractEntity> = PickByValue<
  T,
  AbstractEntity | AbstractEntity[] | Promise<AbstractEntity> | Promise<AbstractEntity[]>
>;

export type PromiseEntityWithoutRelationsExcept<
  T extends Promise<AbstractEntity>,
  TPickedRelations extends keyof PickByValue<
    Awaited<T>,
    AbstractEntity | AbstractEntity[] | Promise<AbstractEntity> | Promise<AbstractEntity[]>
  >
> = Promise<EntityWithoutRelationsExcept<Awaited<T>, TPickedRelations>>;

export type EntityWithSelectedRelations<
  T extends AbstractEntity,
  TRelations extends {
    [key in string]: AbstractEntity | AbstractEntity[] | Promise<AbstractEntity> | Promise<AbstractEntity[]>;
  }
> = TRelations & EntityWithoutRelations<T>;
// Pick<T, TPickedRelations>;
