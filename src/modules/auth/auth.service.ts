import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ERROR_CODE } from '../../constants/common.constant';
import { hashPassword, matchPassword } from '../../utils/bycrypt.util';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UserEntity> {
    const { password, email } = signUpDto;
    const existed = await this.userService.findOneByEmail(email);
    if (existed) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.EMAIL_EXISTED,
        message: 'email already existed',
      });
    }
    const hashed = await hashPassword(password);
    const user = await this.userService.create({
      email,
      password: hashed,
    });
    return user;
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const { password: hashedPassword } = user;
    const isMatched = await matchPassword(password, hashedPassword);
    if (!isMatched) {
      return null;
    }
    return user;
  }

  async signIn(user: UserEntity): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
