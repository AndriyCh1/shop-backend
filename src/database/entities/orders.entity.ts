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
import { UserAddress } from './user-addresses.entity';
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

  // TODO: Possibly, we should store shipping address in a separate entity, since user may change it anytime
  @ManyToOne(() => UserAddress, (address) => address.id)
  shippingAddress: UserAddress;

  @Column({ type: 'timestamp', nullable: true })
  orderDeliveredCarrierDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  orderDeliveredUserDate?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
