import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductVariant } from '#database/entities/product-variants.entity';

import { Cart } from './carts.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Cart, (cart) => cart.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @Index()
  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.id)
  productVariant: ProductVariant;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
