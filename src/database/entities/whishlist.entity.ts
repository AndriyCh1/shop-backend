import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.wishlist)
  user: User;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;
}