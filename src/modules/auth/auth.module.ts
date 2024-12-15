import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '#database/entities/users.entity';
import { AuthController } from '#modules/auth/auth.controller';
import { AuthService } from '#modules/auth/services/auth.service';
import { AuthTokenService } from '#modules/auth/services/auth-token.service';
import { JwtRefreshTokenStrategy } from '#modules/auth/strategies/jwt-refresh.strategy';
import { UsersModule } from '#modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtRefreshTokenStrategy, AuthTokenService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
