import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductCategory } from '#database/entities/product-categories.entity';
import { ProductGallery } from '#database/entities/product-variant-gallery.entity';
import { ProductVariant } from '#database/entities/product-variants.entity';

import { Wishlist } from './wishlist.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 165 })
  shortDescription: string;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  cumulativeRatingSum: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
  )
  productCategories: ProductCategory[];

  @OneToMany(() => ProductGallery, (productGallery) => productGallery.product)
  productGallery: ProductGallery[];

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product, {
    nullable: false,
  })
  productVariants: ProductVariant[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlist: Wishlist[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
