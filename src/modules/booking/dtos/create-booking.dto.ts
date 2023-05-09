import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  BookingStatus,
  BookingStatusValue,
} from 'src/constants/common.constant';
import { objectValueToArray } from 'src/utils/object.util';

export class ServicePyaload {
  @IsNumber()
  id: number;

  @IsNumber()
  quantity: number;
}

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(objectValueToArray(BookingStatus))
  status?: BookingStatusValue;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicePyaload)
  services: ServicePyaload[];
}
