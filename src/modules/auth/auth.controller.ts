import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Public } from '../../decorators/public.decorator';
import { SerializerResponse } from '../../decorators/serializer-response.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @SerializerResponse()
  @Post('sign-in')
  async signIn(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signIn(user, res);
    return user;
  }

  @SerializerResponse()
  @Get('me')
  async getProfile(@CurrentUser() user: UserEntity) {
    return user;
  }
}
