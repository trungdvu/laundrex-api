import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { TokenPayload } from '../auth.type';
import { ERROR_CODE } from '../../../constants/common.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ sub }: TokenPayload) {
    const user = await this.userService.findOneById(sub);
    if (!user) {
      throw new UnauthorizedException({
        errorCode: ERROR_CODE.TOKEN_EXPIRED,
        message: 'access token is expired',
      });
    }
    return user;
  }
}
