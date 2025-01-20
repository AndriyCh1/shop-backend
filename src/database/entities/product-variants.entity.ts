import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductGallery } from '#database/entities/product-variant-gallery.entity';

import { Product } from './products.entity';

export type Attributes = Record<string, string>;

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'int' })
  productId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 165, nullable: true })
  shortDescription?: string;

  @Column({ type: 'numeric' })
  salePrice: number;

  @Column({ type: 'numeric', nullable: true })
  comparedPrice?: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sku?: string;

  @Column({ type: 'smallint' })
  displayOrder: number;

  @Index({ fulltext: true })
  @Column({ type: 'jsonb', nullable: false, default: {} })
  attributes: Attributes;

  @OneToMany(() => ProductGallery, (gallery) => gallery.productVariant)
  productGallery: ProductGallery[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
