import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  BOOKING_STATUS,
  BookingStatusValue,
} from 'src/constants/common.constant';
import { objectValueToArray } from 'src/utils/object.util';
import { ServicePyaload } from './create-booking.dto';

export class UpdateBookingDto {
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(objectValueToArray(BOOKING_STATUS))
  status?: BookingStatusValue;

  @IsOptional()
  deleted?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicePyaload)
  services?: ServicePyaload[];
}
