import { Body, Controller, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Public()
  @Post()
  createBooking(@Body() body: CreateBookingDto) {
    return this.bookingService.create(body);
  }
}
