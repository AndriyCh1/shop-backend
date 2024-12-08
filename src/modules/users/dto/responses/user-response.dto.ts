import { User } from '#database/entities/users.entity';

export class UserResponseDto {
  id: User['id'];
  firstName: User['firstName'];
  lastName: User['lastName'];
  email: User['email'];
  role: User['role'];
}
