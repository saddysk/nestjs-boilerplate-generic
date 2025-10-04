import { AuthUser } from '@skull/core/providers/auth-context.provider';
import { DeleteDateColumn, Column, BeforeSoftRemove } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export class AbstractSoftEntity extends AbstractEntity {
  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;

  // @ManyToOne(() => UserEntity, (user) => user.id)
  // @JoinColumn({
  //   name: 'deletedBy',
  // })
  // deletedByUser?: Promise<UserEntity>;

  @BeforeSoftRemove()
  updateDeletedBy() {
    const authUser = AuthUser.user();
    if (authUser) {
      this.deletedBy = authUser.id;
    }
  }
}
