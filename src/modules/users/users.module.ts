import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '#database/entities/users.entity';
import { UserAbilityFactory } from '#modules/auth/abilities/user.ability';
import { UserService } from '#modules/users/services/users.service';

import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserAbilityFactory],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
