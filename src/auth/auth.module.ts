import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfig } from 'src/config/config';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { UserRepository } from './repositories/user.repository';
import { PublicStrategy } from './strategies/public.strategy';
import { BearerStrategy } from './strategies/bearer.strategy';
import { InternalStrategy } from './strategies/internal.strategy';

const CONFIG = AppConfig();

@Module({
  imports: [
    DatabaseModule.forRepository([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: CONFIG.JWT_PRIVATE_KEY,
      publicKey: CONFIG.JWT_PUBLIC_KEY,
      signOptions: {
        algorithm: 'RS256',
        expiresIn: CONFIG.JWT_EXPIRATION_TIME,
      },
      verifyOptions: {
        algorithms: ['RS256'],
      },
    }),
  ],
  providers: [JwtStrategy, PublicStrategy, BearerStrategy, InternalStrategy],
  controllers: [AuthController],
  exports: [JwtModule, DatabaseModule],
})
export class AuthModule {}
