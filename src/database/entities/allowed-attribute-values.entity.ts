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

import { AllowedAttribute } from './allowed-attributes.entity';

@Entity('allowed_attribute_values')
@Check(`range_max > range_min`)
export class AllowedAttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => AllowedAttribute, (attribute) => attribute.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  attribute: AllowedAttribute;

  @Column({ type: 'varchar', length: 256, nullable: true })
  valueString?: string;

  @Column({ type: 'numeric', nullable: true })
  valueNumber?: number;

  @Column({ type: 'numeric', nullable: true })
  rangeMin?: number;

  @Column({ type: 'numeric', nullable: true })
  rangeMax?: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  colorHex?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
