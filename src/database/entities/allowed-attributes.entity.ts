import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AllowedAttributeTypeEnum {
  STRING = 'string',
  NUMBER = 'number',
  RANGE = 'range',
  COLOR = 'color',
}

@Entity('allowed_attributes')
export class AllowedAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, enum: AllowedAttributeTypeEnum })
  type: AllowedAttributeTypeEnum;

  @Column({ type: 'varchar', length: 256, nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
