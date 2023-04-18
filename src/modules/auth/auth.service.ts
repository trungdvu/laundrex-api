import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { hashPassword, matchPassword } from '../../utils/bycrypt.util';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { secondToMillisecond } from './auth.util';
import { SignUpDto } from './dtos/sign-up.dto';
import { ErrorCode } from '../../constants/error-code.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UserEntity> {
    const { password, email } = signUpDto;
    const existed = await this.userService.findOneByEmail(email);
    if (existed) {
      throw new BadRequestException({
        errorCode: ErrorCode.Auth.EmailAlreadyExists,
        message: 'email already exists',
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

  async signIn(user: UserEntity, res: Response): Promise<void> {
    const tokenPayload = { userId: user.id };
    const token = await this.jwtService.signAsync(tokenPayload);
    const jwtExpiration = this.configService.get('JWT_EXPIRATION');
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: secondToMillisecond(jwtExpiration),
    });
  }

  async signOut(response: Response): Promise<void> {
    response.cookie('Authentication', '', {
      expires: new Date(),
      httpOnly: true,
    });
  }
}
