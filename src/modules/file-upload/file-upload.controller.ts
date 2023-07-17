import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { CreatePresignedUrlDto } from './dots/create-presigned-url.dto';
import { FileUploadService } from './file-upload.service';

@Controller('file-uploads')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('presigned-url')
  @UseInterceptors(TransformInterceptor)
  createPreSignedUrl(
    @Body()
    { filename, folder }: CreatePresignedUrlDto,
  ) {
    const extension = filename.split('.').pop();
    if (!extension) {
      throw new BadRequestException('file extension required');
    }
    return this.fileUploadService.createPresignedUrl({
      extension,
      folder,
    });
  }
}
