import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly email: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly password: string;
}
