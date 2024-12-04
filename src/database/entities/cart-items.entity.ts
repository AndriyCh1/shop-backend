import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Cart } from './carts.entity';
import { Product } from './products.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
