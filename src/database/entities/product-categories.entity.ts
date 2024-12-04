import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from './categories.entity';
import { Product } from './products.entity';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;
}
