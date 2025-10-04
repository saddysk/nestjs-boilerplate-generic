import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetRoute } from '@skull/core/decorators/route.decorators';
import { AuthUserDto } from './dto/auth-user.dto';
import { UserRepository } from './repositories/user.repository';
import { AuthUser } from '@skull/core/providers/auth-context.provider';
import { Statues } from '@skull/core/decorators/auth.decorators';
import { UserStatus } from 'src/database/entities/user.entity';

@Controller('api/v1/auth')
@ApiTags('Auth')
@Statues(UserStatus.Active, UserStatus.Pending)
export class AuthController {
  constructor(private readonly userRepository: UserRepository) {}

  @GetRoute('me', { Ok: AuthUserDto })
  async getCurrentUser(): Promise<AuthUserDto> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: AuthUser.user().id },
    });
    return AuthUserDto.toDto(user);
  }
}
