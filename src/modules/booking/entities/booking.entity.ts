import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from '../../customer/entities/customer.entity';

@Entity('booking')
export class BookingEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => CustomerEntity, (customer) => customer.bookings)
  customer: CustomerEntity;

  @Column({ default: '' })
  description: string;

  @Column()
  total: number;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
