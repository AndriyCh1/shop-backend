import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatusEnum {
  DELIVERED = 'Delivered',
  UNREACHED = 'Unreached',
  PAID = 'Paid',
  CONFIRMED = 'Confirmed',
  PROCESSING = 'Processing',
  PENDING = 'Pending',
  ON_HOLD = 'On Hold',
  SHIPPED = 'Shipped',
  CANCELLED = 'Cancelled',
  REFUSED = 'Refused',
  AWAITING_RETURN = 'Awaiting Return',
  RETURNED = 'Returned',
}

@Entity('order_statuses')
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  statusName: OrderStatusEnum;

  @Column({ type: 'varchar', length: 50 })
  color: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
