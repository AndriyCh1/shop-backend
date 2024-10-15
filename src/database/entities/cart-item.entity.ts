import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Column('int')
  quantity: number;
}
