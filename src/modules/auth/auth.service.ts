import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { isUuid, sendMail } from 'src/utils/common.util';
import { ENV, ERROR_CODE } from '../../constants/common.constant';
import { hashPassword, matchPassword } from '../../utils/bycrypt.util';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

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

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
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
    const token = await this.tokenService.create({
      userId: user.id,
    });
    const isDev = this.configService.get('NODE_ENV') === ENV.DEVELOPMENT;
    const host = isDev ? `http://localhost:3000` : 'https://laundrex.me';
    const verifyLink = `${host}/verify/${user.id}/${token.value}`;
    sendMail(
      {
        to: email,
        subject: 'Confirm your account',
        text: `Hi ${
          email.split('@')[0]
        }, please confirm your account address by visit this: ${verifyLink}`,
      },
      (error) => {
        if (error) {
          console.log('send mail error', error);
        }
      },
    );
    return {
      message: 'sent an email to verify your account',
    };
  }

  async verifyEmail(userId: string, tokenValue: string) {
    if (!isUuid(userId)) {
      throw new BadRequestException('user id must be an uuid');
    }
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('invalid link');
    }
    const token = await this.tokenService.findOne(userId, tokenValue);
    if (!token) {
      throw new BadRequestException('invalid link');
    }
    await this.userService.verifyUser(userId, true);
    await this.tokenService.remove(userId, tokenValue);
    return {
      message: 'email verified successfully',
    };
  }

  async resendCode(userEmail: string) {
    const user = await this.userService.findOneByEmail(userEmail);
    if (!user || user.verified) {
      throw new BadRequestException('the email is invalid or already verified');
    }
    const existedTokens = await this.tokenService.findAll(user.id);
    if (existedTokens.length) {
      await this.tokenService.removeIn(
        existedTokens.map(({ userId }) => userId),
      );
    }
    const token = await this.tokenService.create({
      userId: user.id,
    });
    const isDev = this.configService.get('NODE_ENV') === ENV.DEVELOPMENT;
    const host = isDev ? `http://localhost:3000` : 'https://laundrex.me';
    const verifyLink = `${host}/verify/${user.id}/${token.value}`;
    sendMail(
      {
        to: userEmail,
        subject: 'Confirm your account',
        text: `Please confirm your account by visit this: ${verifyLink}`,
      },
      (error) => {
        if (error) {
          console.log('send mail error', error);
        }
      },
    );
    return {
      message: 'sent an email to verify your account',
    };
  }
}
