import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CartItem } from './cart-item.entity';
import { User } from './user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];
}
