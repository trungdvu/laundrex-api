import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { ServiceModule } from '../service/service.module';
import { BookingService } from './booking.service';
import { BookingDetailEntity } from './entities/booking-detail.entity';
import { BookingEntity } from './entities/booking.entity';
import { BookingController } from './booking.controller';

@Module({
  imports: [
    ServiceModule,
    CustomerModule,
    TypeOrmModule.forFeature([BookingEntity, BookingDetailEntity]),
  ],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
