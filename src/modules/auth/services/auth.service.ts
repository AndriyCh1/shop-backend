import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '#database/entities/users.entity';
import { WrongCredentialsException } from '#modules/auth/exceptions/auth.exception';
import {
  Login as LoginData,
  Signup as SignupData,
} from '#modules/auth/interfaces/auth.interface';
import { TokensPair } from '#modules/auth/interfaces/jwt.interface';
import { AuthTokenService } from '#modules/auth/services/auth-token.service';
import { UserService } from '#modules/users/services/users.service';
import { verifyPassword } from '#shared/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UserService,
    private tokenService: AuthTokenService,
  ) {}

  async signup(payload: SignupData): Promise<TokensPair> {
    const createdUser = await this.usersService.createUser(payload);

    const tokens = await this.tokenService.generateTokenPair({
      sub: createdUser.id,
      role: createdUser.role,
      email: createdUser.email,
    });

    return tokens;
  }

  async login(payload: LoginData): Promise<TokensPair> {
    const user = await this.usersRepository.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      throw new WrongCredentialsException();
    }

    const isPasswordMatching = await verifyPassword(
      payload.password,
      user.passwordHash,
    );

    if (!isPasswordMatching) {
      throw new WrongCredentialsException();
    }

    const tokens = await this.tokenService.generateTokenPair({
      sub: user.id,
      role: user.role,
      email: user.email,
    });

    return tokens;
  }

  async refreshTokens(refreshToken: string): Promise<TokensPair> {
    const tokenPayload = await this.tokenService.verifyRefreshToken(
      refreshToken,
    );

    const tokens = await this.tokenService.generateTokenPair({
      sub: tokenPayload.sub,
      role: tokenPayload.role,
      email: tokenPayload.email,
    });

    return tokens;
  }
}
