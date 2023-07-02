import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePresignedUrlDto {
  @IsNotEmpty()
  @IsString()
  filename: string;
}
