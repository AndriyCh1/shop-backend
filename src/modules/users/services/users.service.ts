import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '#database/entities/users.entity';
import { UserAbilityFactory } from '#modules/auth/abilities/user.ability';
import { Action } from '#modules/auth/policies/base-policy';
import { UserResponseDto } from '#modules/users/dto/responses/user-response.dto';
import {
  CreateUserData,
  UpdateUserData,
} from '#modules/users/interfaces/user.interfaces';
import { UserMapper } from '#modules/users/mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: CreateUserData): Promise<UserResponseDto> {
    const userRecord = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (userRecord) {
      throw new BadRequestException('User already exists');
    }

    const userInstance = this.userRepository.create({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      passwordHash: userData.password,
      role: userData.role,
    });

    const savedUser = await this.userRepository.save(userInstance);

    return UserMapper.toResponse(savedUser);
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    return UserMapper.toResponse(user);
  }
  async update(
    id: number,
    newData: UpdateUserData,
    executor: Pick<User, 'id' | 'role'>,
  ): Promise<UserResponseDto> {
    const abilityForUser = new UserAbilityFactory(executor);
    const userPolicyAbility = abilityForUser.withUserPolicy();

    if (userPolicyAbility.cannot(Action.Update, { id })) {
      throw new BadRequestException('Permission denied');
    }

    const hashedPassword = newData.password
      ? await bcrypt.hash(newData.password, 10)
      : undefined;

    const updateUserResult = await this.userRepository
      .createQueryBuilder()
      .update()
      .where({ id })
      .set({
        firstName: newData.firstName,
        lastName: newData.lastName,
        passwordHash: hashedPassword,
        role: newData.role,
      })
      .returning('*') // Yeah, we need to do so much just to get the updated user - exciting times ahead!
      .execute();

    return UserMapper.toResponse(updateUserResult.raw[0]);
  }

  async remove(id: number, executor: Pick<User, 'id' | 'role'>): Promise<void> {
    const abilityForUser = new UserAbilityFactory(executor);
    const userPolicyAbility = abilityForUser.withUserPolicy();

    if (userPolicyAbility.cannot(Action.Delete, { id })) {
      throw new BadRequestException('Permission denied');
    }

    await this.userRepository.delete(id);
  }
}
