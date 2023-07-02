import { Body, Controller, Put, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TranformInterceptor } from 'src/interceptors/transform.interceptor';
import { FileUploadService } from '../file-upload/file-upload.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Put('me')
  @UseInterceptors(TranformInterceptor)
  async update(
    @CurrentUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const updatedUser = await this.userService.update(user.id, updateUserDto);
    if (updateUserDto.avatar !== user.avatar) {
      await this.fileUploadService.deleteObject(user.avatar);
    }
    return updatedUser;
  }
}
