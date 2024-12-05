import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Wishlist } from './wishlist.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToOne(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
