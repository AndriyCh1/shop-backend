import { AbilityBuilder, MongoQuery } from '@casl/ability';
import { AnyObject } from '@casl/ability/dist/types/types';

export type Rule = (
  action: string,
  conditions?: MongoQuery<AnyObject>,
) => ReturnType<typeof AbilityBuilder.prototype.can>;

export interface RuleAdder {
  can: Rule;
  cannot: Rule;
}

export interface PolicyDefinition<T> {
  name: string;
  defineRules: (addRule: RuleAdder, context: T) => void;
}

export abstract class BasePolicy<T> implements PolicyDefinition<T> {
  abstract name: string;
  abstract defineRules(addRule: RuleAdder, context: T): void;
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
