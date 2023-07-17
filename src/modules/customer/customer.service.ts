import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_CODE } from 'src/constants/common.constant';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async findById(id: string): Promise<CustomerEntity> {
    return this.customerRepository.findOne({
      where: { id },
    });
  }

  async findByUsername(username: string) {
    return this.customerRepository.findOneBy({ username });
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const existed = await this.findByUsername(createCustomerDto.username);
    if (existed) {
      throw new BadRequestException({
        errorCode: ERROR_CODE.CUSTOMER_EXISTED,
        message: 'customer already existed',
      });
    }
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerEntity> {
    const service = await this.customerRepository.preload({
      id,
      ...updateCustomerDto,
    });
    if (!service) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return this.customerRepository.save(service);
  }

  async remove(id: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository.preload({
      id,
      deteled: true,
    });
    if (!customer) {
      throw new BadRequestException(`customer #${id} not found`);
    }
    return this.customerRepository.save(customer);
  }
}
