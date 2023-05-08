import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetailEntity } from './entities/booking-detail.entity';
import { BookingEntity } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity, BookingDetailEntity])],
})
export class BookingModule {}
