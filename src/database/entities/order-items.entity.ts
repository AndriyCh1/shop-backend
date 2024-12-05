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
  @ManyToOne(() => ProductVariant, (variant) => variant.id)
  productVariant: ProductVariant;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    type: 'numeric',
    generatedType: 'STORED',
    asExpression: 'price * quantity',
  })
  total: number;
}
