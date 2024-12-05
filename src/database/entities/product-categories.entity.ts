import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from './categories.entity';
import { Product } from './products.entity';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Index()
  @ManyToOne(() => Category, (category) => category.id)
  category: Category;
}
