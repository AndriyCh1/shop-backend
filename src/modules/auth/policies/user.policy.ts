import { UserRole } from '#shared/constants/user-role.enum';

import { Action, RuleAdder } from './base-policy';
import { UserBasedPolicy, UserContext } from './user-based-policy';

export class UserPolicy extends UserBasedPolicy {
  name = 'User';

  defineRules({ can, cannot }: RuleAdder, user: UserContext): void {
    if (user.role === UserRole.ADMIN) {
      can(Action.Manage);
    } else {
      can(Action.Read, { id: user.id });
      can(Action.Update, { id: user.id });
      cannot(Action.Delete);
    }
  }
}

export const userPolicy = new UserPolicy();
