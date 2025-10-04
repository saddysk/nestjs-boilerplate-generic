import { UserRepository } from './../repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { AppConfig } from 'src/config/config';
import { IAuthUser } from '@skull/core/interfaces/auth-user.interface';
import { Request } from 'express';
import { UserStatus } from 'src/database/entities/user.entity';
// import { Not } from 'typeorm';

const CONFIG = AppConfig();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: CONFIG.JWT_PUBLIC_KEY,
      algorithms: ['RS256'],
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(request: Request): Promise<IAuthUser> {
    // TODO: add access token validation
    // const accessToken = await this.authAccessTokenRepository.validateAndGetToken(args, request);

    // if (!accessToken) {
    //   throw new UnauthorizedException('Token is expired');
    // }

    // TODO: add user validation
    // const user = await this.userRepository.findOne({
    //   where: {
    //     id: accessToken.userId,
    //     status: Not(UserStatus.Suspended),
    //   },
    // });

    const user = {
      id: 'user-id',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      status: UserStatus.Active,
    };

    if (user == null) {
      throw new UnauthorizedException();
    }

    // If impersonate Id is set and user has permission to do so
    // Return impersonated user
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
    };
  }
}
