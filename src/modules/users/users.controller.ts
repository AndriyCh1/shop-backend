import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtRefreshGuard } from '#modules/auth/guards/jwt-refresh.guard';
import { AuthUser } from '#modules/auth/interfaces/auth.interface';
import { CreateUserDto } from '#modules/users/dto/requests/create-user.dto';
import { UpdateUserDto } from '#modules/users/dto/requests/update-user.dto';
import { UserResponseDto } from '#modules/users/dto/responses/user-response.dto';
import { UserService } from '#modules/users/services/users.service';
import { User } from '#shared/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UserService) {}

  @Get(':id')
  @UseGuards(JwtRefreshGuard)
  findOne(@Param('id') id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  createUser(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtRefreshGuard)
  updateUser(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
    @User() user: AuthUser,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto, user);
  }
}
