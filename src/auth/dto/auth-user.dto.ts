import {
  DateFieldOptional,
  EmailField,
  EnumField,
  StringField,
  StringFieldOptional,
} from '@skull/core/decorators';
import { User, UserAccountType, UserStatus } from 'src/database/entities/user.entity';

export class AuthUserMinimalDto {
  @StringField()
  id: string;

  @StringField()
  firstName: string;

  @StringField()
  lastName: string;

  @EmailField()
  email: string;

  @EnumField(() => UserAccountType)
  accountType: UserAccountType;

  @StringFieldOptional()
  profilePicture?: string;

  constructor(user?: User) {
    if (user == null) {
      return;
    }

    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.profilePicture = user.profilePicture;
    this.accountType = user.accountType;
  }
}

export class AuthUserDto extends AuthUserMinimalDto {
  @StringFieldOptional()
  phone?: string;

  @EnumField(() => UserStatus)
  status: UserStatus;

  @DateFieldOptional()
  createdAt?: Date;

  @DateFieldOptional()
  updatedAt?: Date;

  protected constructor(user?: User) {
    super(user);

    if (user == null) {
      return;
    }

    this.phone = user.phone;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static async toDto(user: User): Promise<AuthUserDto> {
    const dto = new AuthUserDto(user);

    return dto;
  }
}
