import { UserRole } from '#shared/constants/user-role.enum';

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}

export type UpdateUserData = Partial<CreateUserData>;
