import { IAbstractSoftEntity, IMetadata } from './abstract.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LowerCaseTransformer } from '../transformers/lowercase';

export enum UserStatus {
  Pending = 'pending',
  Active = 'active',
  Suspended = 'suspended',
}

export enum UserAccountType {
  Email = 'email',
  Google = 'google',
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

@Index(['email', 'deletedAt'], {
  unique: true,
  where: '"deletedAt" IS NULL',
})
@Entity()
export class User implements IAbstractSoftEntity<string> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    transformer: LowerCaseTransformer,
  })
  @Index()
  email: string;

  @Column({
    nullable: true,
  })
  password?: string;

  @Column({
    nullable: true,
  })
  phone?: string;

  @Column()
  roleId: number;

  @Column({ type: 'enum', default: UserAccountType.Email, enum: UserAccountType })
  accountType: UserAccountType;

  @Column({
    nullable: true,
  })
  profilePicture?: string;

  @Column({
    nullable: true,
  })
  position?: string;

  @Column({
    type: 'enum',
    default: UserStatus.Pending,
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({
    nullable: true,
  })
  lastLoginAt?: Date;

  @Column({
    nullable: true,
  })
  organizationId?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  public flags?: IUserFlags;

  @Column({
    type: 'json',
    nullable: true,
  })
  data?: IUserData;

  // User onboarding data
  @Column({
    type: 'json',
    nullable: true,
  })
  userData?: IMetadata;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

export interface IUserFlags {
  introModal?: boolean;
  earlyAccess?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserData {
  // ...
}
