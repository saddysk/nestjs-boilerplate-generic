import { isEmpty } from 'lodash';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AppConfig } from 'src/config/config';
import { UserStatus } from 'src/database/entities/user.entity';
import { IAuthUser } from '@skull/core/interfaces/auth-user.interface';

const CONFIG = AppConfig();

/**
 * Stretegy to secure internal endpoints
 */
@Injectable()
export class InternalStrategy extends PassportStrategy(Strategy, 'internal') {
  constructor() {
    super();
  }

  async validate(plainToken: string): Promise<Pick<IAuthUser, 'status'>> {
    if (isEmpty(plainToken)) {
      throw new UnauthorizedException('Token is missing');
    }

    if (CONFIG.INTERNAL_API_TOKEN !== plainToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      status: UserStatus.Active,
    };
  }
}
