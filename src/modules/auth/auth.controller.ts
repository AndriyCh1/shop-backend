import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { LoginDto } from '#modules/auth/dto/request/login.dto';
import { RefreshTokenDto } from '#modules/auth/dto/request/refresh-token.dto';
import { SignupDto } from '#modules/auth/dto/request/signup.dto';
import { TokensPair } from '#modules/auth/interfaces/jwt.interface';
import { AuthService } from '#modules/auth/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<TokensPair> {
    return this.authService.login(dto);
  }

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<TokensPair> {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokensPair> {
    return this.authService.refreshTokens(dto.refreshToken);
  }
}
