import { userPolicy } from '#modules/auth/policies/user.policy';
import { UserContext } from '#modules/auth/policies/user-based-policy';

import { BaseAbility } from './base-ability';

export class UserAbilityFactory extends BaseAbility<UserContext> {
  constructor(user: UserContext) {
    super(user);
  }

  public withUserPolicy() {
    return this.applyPolicy(userPolicy);
  }

  // E.g. How to apply multiple policies
  // public withPostPolicy() {
  //   return this.applyPolicy(postPolicy);
  // }
}
