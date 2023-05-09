import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { ServiceEntity } from './entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}

  async findByIds(ids: number[]): Promise<ServiceEntity[]> {
    return this.serviceRepository.find({
      where: { id: In(ids) },
    });
  }

  async create(createServiceDto: CreateServiceDto): Promise<ServiceEntity> {
    const service = this.serviceRepository.create(createServiceDto);
    return this.serviceRepository.save(service);
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceEntity> {
    const service = await this.serviceRepository.preload({
      id,
      ...updateServiceDto,
    });
    if (!service) {
      throw new NotFoundException(`Service #${id} not found`);
    }
    return this.serviceRepository.save(service);
  }
}
