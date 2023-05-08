import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsOptional()
  readonly displayName?: string;
}
