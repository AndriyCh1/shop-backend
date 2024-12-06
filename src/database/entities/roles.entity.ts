import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole as UserRoleEnum } from '../../shared/constants/user-role.enum';
import { UserRole } from './user-roles.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    enum: UserRoleEnum,
    default: UserRoleEnum.CUSTOMER,
  })
  name: UserRoleEnum;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
