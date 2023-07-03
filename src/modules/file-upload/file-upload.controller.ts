import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TranformInterceptor } from 'src/interceptors/transform.interceptor';
import { UserEntity } from '../user/entities/user.entity';
import { CreatePresignedUrlDto } from './dots/create-presigned-url.dto';
import { FileUploadService } from './file-upload.service';

@Controller('file-uploads')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('presigned-url')
  @UseInterceptors(TranformInterceptor)
  createPreSignedUrl(
    @CurrentUser() user: UserEntity,
    @Body() { filename }: CreatePresignedUrlDto,
  ) {
    const extenstion = filename.split('.').pop();
    if (!extenstion) {
      throw new BadRequestException('file extenstion required');
    }
    return this.fileUploadService.createPresignedUrl(user.id, extenstion);
  }

  @Post('/cleaning')
  @UseInterceptors(TranformInterceptor)
  deleteFile(@Body('key') key: string) {
    return this.fileUploadService.deleteObject(key);
  }
}
