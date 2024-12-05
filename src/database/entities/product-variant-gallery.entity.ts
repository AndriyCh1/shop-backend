import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductVariant } from './product-variants.entity';

@Entity('product_variant_gallery')
export class ProductVariantGallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => ProductVariant, (variant) => variant.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  productVariant: ProductVariant;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
