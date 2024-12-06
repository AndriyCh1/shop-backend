import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { User } from '#database/entities/users.entity';
import { UserRole } from '#shared/constants/user-role.enum';

type Subjects = InferSubjects<typeof User> | 'all';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User & { roles: UserRole[] }) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.roles.includes(UserRole.ADMIN)) {
      can(Action.Manage, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
