import { User } from '#database/entities/users.entity';
import { UserRole } from '#shared/constants/user-role.enum';

export interface Login {
  email: string;
  password: string;
}

export interface Signup {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthUser {
  id: User['id'];
  role: User['role'];
  email: User['email'];
}
