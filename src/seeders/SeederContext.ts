import { AccountEntity, RoleEntity } from '@entities';
import { EntityName } from '@mikro-orm/core';

export type SeederContextItem = {
  csvFile: string;
  entity: EntityName<{ name: string }>;
};

export const SEEDER_CONTEXTS: SeederContextItem[] = [
  { csvFile: 'accounts.csv', entity: AccountEntity },
  { csvFile: 'roles.csv', entity: RoleEntity },
];
