import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { keyBy } from 'lodash';
import { BOOKING_STATUS } from 'src/constants/common.constant';
import { DataSource, Repository } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { ServiceService } from '../service/service.service';
import { calculateBookingTotal } from './booking.util';
import { CreateBookingDetailDto } from './dtos/create-booking-detail.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { BookingDetailEntity } from './entities/booking-detail.entity';
import { BookingEntity } from './entities/booking.entity';

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

  async findAll() {
    return this.bookingRepository.find();
  }

  async findBookingById(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: {
        customer: true,
      },
    });
    if (!booking) {
      throw new BadRequestException(`booking #${id} not found`);
    }
    const bookingDetails = await this.bookingDetailRepository.find({
      where: { bookingId: id },
    });
    return { ...booking, bookingDetails };
  }

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    const { services: servicesPayload, customerId, ...rest } = createBookingDto;
    const servicePayloadIds = servicesPayload.map((service) => service.id);
    const keyedServicesPayload = keyBy(servicesPayload, 'id') as any;

    const customer = await this.customerService.findById(customerId);

    if (!customer) {
      throw new BadRequestException(`customer #${customerId} not found`);
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
        status: BOOKING_STATUS.CONFIRMED,
        total: 0,
        customer,
        ...rest,
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
    if (!booking) {
      throw new Error(`booking #${id} not found`);
    }
    return this.bookingRepository.save(booking);
  }

  async remove(id: number) {
    const booking = await this.bookingRepository.preload({
      id,
      deteled: true,
    });
    if (!booking) {
      throw new Error(`booking #${id} not found`);
    }
    return this.bookingRepository.save(booking);
  }
}
