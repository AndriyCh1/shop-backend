import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './products.entity';
import { User } from './users.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;
}
