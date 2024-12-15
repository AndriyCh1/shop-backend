import { UserRole } from '#shared/constants/user-role.enum';

export interface JwtPayload {
  sub: number;
  role: UserRole;
}

export interface TokensPair {
  accessToken: string;
  refreshToken: string;
}
