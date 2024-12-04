import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
