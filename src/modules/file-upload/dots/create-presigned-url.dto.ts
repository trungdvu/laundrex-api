import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePresignedUrlDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsOptional()
  @IsString()
  @IsIn(['avatars'])
  folder?: string;
}
