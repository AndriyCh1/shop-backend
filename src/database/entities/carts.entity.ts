import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './users.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
