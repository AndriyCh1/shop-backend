import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '#database/entities/users.entity';
import {
  Login as LoginData,
  Signup as SignupData,
} from '#modules/auth/interfaces/auth.interface';
import { TokensPair } from '#modules/auth/interfaces/jwt.interface';
import { AuthTokenService } from '#modules/auth/services/auth-token.service';
import { UserService } from '#modules/users/services/users.service';
import { hashPassword, verifyPassword } from '#shared/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersService: UserService,
    private tokenService: AuthTokenService,
  ) {}

  async signup(data: SignupData): Promise<TokensPair> {
    const hash = await hashPassword(data.password);

    const createdUser = await this.usersService.create({
      email: data.email,
      password: hash,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const tokens = await this.tokenService.generateTokenPair({
      sub: createdUser.id,
      role: createdUser.role,
    });

    return tokens;
  }

  async login(data: LoginData): Promise<TokensPair> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const isPasswordMatching = await verifyPassword(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const tokens = await this.tokenService.generateTokenPair({
      sub: user.id,
      role: user.role,
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
    });

    return tokens;
  }
}
