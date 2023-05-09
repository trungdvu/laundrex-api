import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingDetailDto {
  @IsString()
  @IsNotEmpty()
  bookingId: number;

  @IsString()
  @IsNotEmpty()
  serviceId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}
