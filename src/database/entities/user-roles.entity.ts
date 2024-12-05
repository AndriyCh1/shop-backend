import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Role } from './roles.entity';
import { User } from './users.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  roleId: number;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.id, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
