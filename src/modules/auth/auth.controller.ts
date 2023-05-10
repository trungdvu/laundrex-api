import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Public } from '../../decorators/public.decorator';
import { SerializerResponse } from '../../decorators/serializer-response.decorator';
import { TranformInterceptor } from '../../interceptors/transform.interceptor';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Public()
  @UseInterceptors(TranformInterceptor)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @Public()
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(TranformInterceptor)
  @HttpCode(HttpStatus.OK)
  @SerializerResponse()
  async signIn(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signIn(user, res);
    return user;
  }

  @Get('me')
  @UseInterceptors(TranformInterceptor)
  @SerializerResponse()
  async getProfile(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Post('sign-out')
  @Public()
  @UseInterceptors(TranformInterceptor)
  @HttpCode(HttpStatus.OK)
  async signOut(@Res({ passthrough: true }) res: Response) {
    await this.authService.signOut(res);
    return true;
  }
}
