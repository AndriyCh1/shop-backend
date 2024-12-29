import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Product } from '#database/entities/products.entity';

import { ProductVariant } from './product-variants.entity';

@Entity('product_gallery')
export class ProductGallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  product: Product;

  @ManyToOne(() => ProductVariant, (variant) => variant.id, {
    onDelete: 'CASCADE',
  })
  productVariant: ProductVariant;

  @Column({ type: 'text' })
  image: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
