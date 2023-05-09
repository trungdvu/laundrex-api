import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { keyBy } from 'lodash';
import { BookingStatus } from 'src/constants/common.constant';
import { DataSource, Repository } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { ServiceService } from '../service/service.service';
import { calculateBookingTotal } from './booking.util';
import { CreateBookingDetailDto } from './dtos/create-booking-detail.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { BookingDetailEntity } from './entities/booking-detail.entity';
import { BookingEntity } from './entities/booking.entity';
import { UpdateBookingDto } from './dtos/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(BookingDetailEntity)
    private readonly bookingDetailRepository: Repository<BookingDetailEntity>,
    private readonly customerService: CustomerService,
    private readonly serviceService: ServiceService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    const { services: servicesPayload, ...rest } = createBookingDto;
    const servicePayloadIds = servicesPayload.map((service) => service.id);
    const keyedServicesPayload = keyBy(servicesPayload, 'id') as any;

    const customer = await this.customerService.findById(rest.customerId);

    if (!customer) {
      throw new BadRequestException(`customer #${rest.customerId} not found`);
    }

    const services = await this.serviceService.findByIds(servicePayloadIds);

    if (servicePayloadIds.length !== services.length) {
      throw new BadRequestException(`service ids incorrect`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const booking = await this.bookingRepository.save({
        ...rest,
        status: BookingStatus.Confirmed,
        total: 0,
      });

      const bookingDetails = await Promise.all(
        services.map(({ id, price }) =>
          this.bookingDetailRepository.save({
            bookingId: booking.id,
            serviceId: id,
            price: price,
            quantity: keyedServicesPayload[id].quantity,
          }),
        ),
      );

      const total = calculateBookingTotal(bookingDetails);

      return this.update(booking.id, { total });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async createBookingDetail(
    createBookingDetailDto: CreateBookingDetailDto,
  ): Promise<BookingDetailEntity> {
    const bookingDetail = this.bookingDetailRepository.create(
      createBookingDetailDto,
    );
    return this.bookingDetailRepository.save(bookingDetail);
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingRepository.preload({
      id,
      ...updateBookingDto,
    });
    return this.bookingRepository.save(booking);
  }
}
