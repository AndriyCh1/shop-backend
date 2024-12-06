import { Role } from '#database/entities/roles.entity';
import { UserRole as UserRoleEnum } from '#shared/constants/user-role.enum';

export const roles: Partial<Role>[] = [
  { id: 1, name: UserRoleEnum.CUSTOMER },
  { id: 2, name: UserRoleEnum.SELLER },
  { id: 3, name: UserRoleEnum.ADMIN },
];
