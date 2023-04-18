import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.update(userId, updateUserDto);
  }
}
