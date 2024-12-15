import { User } from '#database/entities/users.entity';
import { UserResponseDto } from '#modules/users/dto/responses/user-response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }
}
