import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TranformInterceptor } from 'src/interceptors/transform.interceptor';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UseInterceptors(TranformInterceptor)
  create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    return this.customerService.create(createCustomerDto);
  }

  @Delete(':id')
  @UseInterceptors(TranformInterceptor)
  remove(@Param('id') id: string): Promise<CustomerEntity> {
    return this.customerService.remove(id);
  }
}
