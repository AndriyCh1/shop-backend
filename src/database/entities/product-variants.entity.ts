import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Product } from './products.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  product: Product;

  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 165, nullable: true })
  shortDescription?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'varchar', length: 255 })
  sku: string;

  @Column({ type: 'int' })
  sequenceNumber: number;

  @Column({ type: 'numeric', nullable: true })
  salePrice?: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'jsonb', nullable: true })
  attributes?: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
