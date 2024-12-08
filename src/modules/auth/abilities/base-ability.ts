import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';

import { PolicyDefinition } from '#modules/auth/policies/base-policy';

type PropertyKey = string | number | symbol;
type AnyObject = Record<PropertyKey, unknown>;

export abstract class BaseAbility<Context> {
  private readonly builder = new AbilityBuilder(createMongoAbility);

  constructor(private readonly context: Context) {}

  private defineRule(type: 'can' | 'cannot', subject: string) {
    return (action: string, conditions?: MongoQuery<AnyObject>) => {
      return this.builder[type](action, subject, conditions);
    };
  }

  protected applyPolicy(policy: PolicyDefinition<Context>): MongoAbility {
    policy.defineRules(
      {
        can: this.defineRule('can', policy.name),
        cannot: this.defineRule('cannot', policy.name),
      },
      this.context,
    );

    return this.builder.build({
      detectSubjectType: () => policy.name,
    });
  }
}
