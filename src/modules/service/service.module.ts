import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from './entities/service.entity';
import { ServiceService } from './service.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity])],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
