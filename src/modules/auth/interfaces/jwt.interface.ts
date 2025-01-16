import { UserRole } from '#shared/constants/user-role.enum';

export interface JwtPayload {
  sub: number;
  role: UserRole;
  email: string;
}

export interface TokensPair {
  accessToken: string;
  refreshToken: string;
}
