import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductCategory } from '#database/entities/product-categories.entity';

import { Wishlist } from './wishlist.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'numeric', default: 0 })
  salePrice: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 165 })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'text' })
  previewImage: string;

  @Column({ type: 'int', default: 0 })
  cumulativeRatingSum: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
  )
  productCategories: ProductCategory[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlist: Wishlist[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
