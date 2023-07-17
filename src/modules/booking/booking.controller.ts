import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @UseInterceptors(TransformInterceptor)
  getBookings() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  getBookingDetail(@Param('id') id: number) {
    return this.bookingService.findBookingById(id);
  }

  @Post()
  @UseInterceptors(TransformInterceptor)
  createBooking(@Body() body: CreateBookingDto) {
    return this.bookingService.create(body);
  }
  @Delete(':id')
  @UseInterceptors(TransformInterceptor)
  removeBooking(@Param('id') id: number) {
    return this.bookingService.remove(id);
  }
}
