import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './users.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
