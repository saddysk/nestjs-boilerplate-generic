import { AbstractRepository } from 'src/database/repositories/abstract.repository';
import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { User, UserAccountType, UserStatus } from 'src/database/entities/user.entity';
import { AppConfig } from 'src/config/config';

const CONFIG = AppConfig();

@DatabaseRepository(User)
export class UserRepository extends AbstractRepository<User> {
  getActiveUserByEmail(email: string) {
    return this.findOne({
      where: {
        email: email,
        status: UserStatus.Active,
      },
    });
  }

  getActiveUserById(id: string) {
    return this.findOne({
      where: {
        id: id,
        status: UserStatus.Active,
      },
    });
  }

  async upsertUser(email: string, accountType: UserAccountType = UserAccountType.Email, status?: UserStatus) {
    let user = await this.findOne({
      where: {
        email: email,
      },
    });

    if (user == null) {
      user = new User();
      user.email = email;
      user.firstName = '';
      user.lastName = '';
      user.accountType = accountType;
      user.status = status ?? CONFIG.AUTH_AUTO_REGISTRATION ? UserStatus.Active : UserStatus.Pending;

      await this.save(user, { reload: true });
      user = await this.findOne({
        where: {
          email: email,
        },
      });
    }

    return user;
  }
}
