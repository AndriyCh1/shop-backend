import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './products.entity';
import { User } from './users.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => User, (user) => user.wishlist)
  user: User;

  @Index()
  @ManyToOne(() => Product, (product) => product.wishlist)
  product: Product;
}
