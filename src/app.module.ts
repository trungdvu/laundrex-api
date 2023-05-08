import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { AppController } from './app.controller';
import { configModuleOptions } from './configs/config-module-options.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BookingModule } from './modules/booking/booking.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ServiceModule } from './modules/service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    BookingModule,
    CustomerModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
