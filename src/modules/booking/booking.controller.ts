import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { TranformInterceptor } from 'src/interceptors/transform.interceptor';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseInterceptors(TranformInterceptor)
  createBooking(@Body() body: CreateBookingDto) {
    return this.bookingService.create(body);
  }
}
