import { User } from '#database/entities/users.entity';

import { BasePolicy, RuleAdder } from './base-policy';

export type UserContext = Pick<User, 'id' | 'role'>;

export abstract class UserBasedPolicy extends BasePolicy<UserContext> {
  define: (addRule: RuleAdder, user: UserContext) => void;
}
