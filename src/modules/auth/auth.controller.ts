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

  @Public()
  @UseInterceptors(TranformInterceptor)
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(TranformInterceptor)
  @HttpCode(HttpStatus.OK)
  @SerializerResponse()
  @Post('sign-in')
  async signIn(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signIn(user, res);
    return user;
  }

  @UseInterceptors(TranformInterceptor)
  @SerializerResponse()
  @Get('me')
  async getProfile(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Public()
  @UseInterceptors(TranformInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  async signOut(@Res({ passthrough: true }) res: Response) {
    await this.authService.signOut(res);
    return true;
  }
}
