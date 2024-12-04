import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './users.entity';

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @Column({ type: 'text' })
  addressLine1: string;

  @Column({ type: 'text', nullable: true })
  addressLine2?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Column({ type: 'varchar', length: 255 })
  postalCode: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
