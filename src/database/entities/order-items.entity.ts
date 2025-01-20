import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Order } from './orders.entity';
import { ProductVariant } from './product-variants.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Order, (order) => order.id)
  order: Order;

  @Index()
  @ManyToOne(() => ProductVariant, (variant) => variant.id, {
    onDelete: 'SET NULL',
  })
  productVariant: ProductVariant;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'numeric' })
  total: number;

  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  productVariantName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  productVariantSku?: string;
}
