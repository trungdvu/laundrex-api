import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingEntity } from './booking.entity';
import { ServiceEntity } from '../../service/entities/service.entity';

@Entity('booking-detail')
export class BookingDetailEntity {
  @PrimaryColumn()
  bookingId: number;

  @PrimaryColumn()
  serviceId: number;

  @ManyToOne(() => BookingEntity, (booking) => booking.id)
  @JoinColumn({ name: 'bookingId' })
  booking: BookingEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.id)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
