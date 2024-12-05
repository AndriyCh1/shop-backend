import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Product } from './products.entity';
import { User } from './users.entity';

@Entity('product_reviews')
@Check(`rating >= 1 AND rating <= 5`)
export class ProductReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  product: Product;

  @Index()
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @Column({ type: 'smallint' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  reviewText?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
