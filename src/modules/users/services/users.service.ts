import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '#database/entities/users.entity';
import { UserAbilityFactory } from '#modules/auth/abilities/user.ability';
import { Action } from '#modules/auth/policies/base-policy';
import { UserAlreadyExistsException } from '#modules/users/exceptions/user.exception';
import {
  CreateUserData,
  UpdateUserData,
} from '#modules/users/interfaces/user.interfaces';
import { PermissionDeniedException } from '#shared/exceptions/permission.exception';
import { hashPassword } from '#shared/utils/password.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(payload: CreateUserData): Promise<User> {
    const userRecord = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (userRecord) {
      throw new UserAlreadyExistsException(payload.email);
    }

    const passwordHash = await hashPassword(payload.password);

    const userInstance = this.userRepository.create({
      ...payload,
      passwordHash,
    });

    const savedUser = await this.userRepository.save(userInstance);

    return savedUser;
  }

  async getUser(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(
    id: number,
    payload: UpdateUserData,
    executor: Pick<User, 'id' | 'role'>,
  ): Promise<User> {
    const abilityForUser = new UserAbilityFactory(executor);
    const userPolicyAbility = abilityForUser.withUserPolicy();

    if (userPolicyAbility.cannot(Action.Update, { id })) {
      throw new PermissionDeniedException();
    }

    const passwordHash = payload.password
      ? await bcrypt.hash(payload.password, 10)
      : undefined;

    const updateUserResult = await this.userRepository
      .createQueryBuilder()
      .update()
      .where({ id })
      .set({ ...payload, passwordHash })
      .returning('*') // Yeah, we need to do so much just to get the updated user - exciting times ahead!
      .execute();

    return updateUserResult.raw[0];
  }

  async deleteUser(
    id: number,
    executor: Pick<User, 'id' | 'role'>,
  ): Promise<void> {
    const abilityForUser = new UserAbilityFactory(executor);
    const userPolicyAbility = abilityForUser.withUserPolicy();

    if (userPolicyAbility.cannot(Action.Delete, { id })) {
      throw new PermissionDeniedException();
    }

    await this.userRepository.delete(id);
  }
}
