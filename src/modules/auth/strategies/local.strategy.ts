import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';
import { ERROR_CODE } from '../../../constants/error-code.constant';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE.AUTH.USER_NOT_FOUND,
        message: 'user not found',
      });
    }
    return user;
  }
}
