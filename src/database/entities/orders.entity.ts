import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OrderItem } from './order-items.entity';
import { OrderStatus } from './order-statuses.entity';
import { User } from './users.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order)
  orderItems: OrderItem[];

  @Column({ type: 'numeric' })
  total: number;

  @Index()
  @ManyToOne(() => OrderStatus, (status) => status.id, { onDelete: 'SET NULL' })
  orderStatus: OrderStatus;

  @Column({ type: 'timestamp', nullable: true })
  orderDeliveredCarrierDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  orderDeliveredUserDate?: Date;

  @Column({ type: 'varchar', length: 100 })
  customerFirstName?: string;

  @Column({ type: 'varchar', length: 100 })
  customerLastName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'text' })
  addressLine1: string;

  @Column({ type: 'text', nullable: true })
  addressLine2?: string;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'varchar', length: 255 })
  state?: string;

  @Column({ type: 'varchar', length: 255 })
  postalCode: string;

  // TODO: paymentMethod: string; // e.g. Stripe (enum)

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
