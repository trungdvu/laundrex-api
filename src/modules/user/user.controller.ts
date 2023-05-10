import {
  Body,
  Controller,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { TranformInterceptor } from 'src/interceptors/transform.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  @UseInterceptors(TranformInterceptor)
  update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.update(userId, updateUserDto);
  }
}
