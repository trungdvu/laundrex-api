import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validate as classValidate } from 'class-validator';
import { Strategy } from 'passport-local';
import { objectValueToArray } from 'src/utils/object.util';
import { ErrorCode } from '../../../constants/error-code.constant';
import { UserEntity } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';
import { SignInDto } from '../dtos/sign-in.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const signInDto = new SignInDto();
    signInDto.email = email;
    signInDto.password = password;

    const errors = await classValidate(signInDto);

    if (errors.length) {
      throw new BadRequestException(
        objectValueToArray(errors[0].constraints)[0],
      );
    }

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException({
        errorCode: ErrorCode.UserNotFound,
        message: 'user not found',
      });
    }

    return user;
  }
}
