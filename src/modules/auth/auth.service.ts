import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { checkPassword, hashPassword } from './auth.util';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(signUpDto: SignUpDto) {
    const { password, email } = signUpDto;
    const hashed = await hashPassword(password);
    await this.userService.create({ email, password: hashed });

    return 'Sign up successfully';
  }

  async signIn(signInDto: SignInDto) {
    const { password, email } = signInDto;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new InternalServerErrorException();
    }
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('incorrect password');
    }

    return 'Sign in successfully';
  }
}
