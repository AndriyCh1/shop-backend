import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './products.entity';
import { User } from './users.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Index()
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;
}
