import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Public } from '../../decorators/public.decorator';
import { SerializerResponse } from '../../decorators/serializer-response.decorator';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Public()
  @UseInterceptors(TransformInterceptor)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @Public()
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(TransformInterceptor)
  @HttpCode(HttpStatus.OK)
  @SerializerResponse()
  async signIn(@CurrentUser() user: UserEntity) {
    const accessToken = await this.authService.signIn(user);
    return { accessToken };
  }

  @Get('me')
  @UseInterceptors(TransformInterceptor)
  @SerializerResponse()
  async getProfile(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Public()
  @Post('v2/sign-up')
  @UseInterceptors(TransformInterceptor)
  async signInWithEmailConfirm(@Body() signUpDto: SignUpDto) {
    return this.authService.signUpV2(signUpDto);
  }

  @Public()
  @Get('v2/verify/:userId/:token')
  @UseInterceptors(TransformInterceptor)
  async verifyEmail(
    @Param('userId') userId: string,
    @Param('token') token: string,
  ) {
    return this.authService.verifyEmail(userId, token);
  }
}
