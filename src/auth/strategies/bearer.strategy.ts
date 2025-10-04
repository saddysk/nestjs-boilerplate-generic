import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IAuthUser } from '@skull/core/interfaces/auth-user.interface';
import { Strategy } from 'passport-http-bearer';
import { UserStatus } from 'src/database/entities/user.entity';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(plainToken: string): Promise<IAuthUser> {
    // TODO: add access token validation
    // if (!plainToken.startsWith('pav1_')) {
    //   throw new UnauthorizedException('Invalid token');
    // }

    // TODO: add user validation
    // const token = await this.personalAccessTokenService.validateAndGetToken(plainToken);

    // if (token == null) {
    //   throw new UnauthorizedException();
    // }

    // const user = token.user;

    const user = {
      id: 'user-id',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      status: UserStatus.Active,
    };

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
    };
  }
}
