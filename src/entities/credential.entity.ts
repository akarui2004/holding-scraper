import { CredentialType } from '@enums';
import { StringType, DateTimeType } from '@mikro-orm/core';
import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './base.entity';
import { AccountEntity } from './account.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'credentials' })
@Filter({ name: 'userOnly', cond: { ownerType: 'user' } })
export class CredentialEntity extends BaseEntity {
  @ManyToOne(() => AccountEntity) // Easy to query credentials by account and also to ensure the credential belongs to the account
  account!: AccountEntity;

  @ManyToOne(() => UserEntity, { fieldName: 'ownerId' })
  user!: UserEntity;

  @Property({ type: StringType, length: 255 })
  accessKey!: string;

  @Property({ type: StringType, length: 255 })
  secret!: string;

  @Property({ type: StringType, length: 128 })
  ownerType!: string;

  @Property({ type: StringType, length: 128 })
  type!: CredentialType;

  @Property({ type: DateTimeType, nullable: true })
  deletedAt!: Date | null;

  @Property({ type: DateTimeType })
  declare createdAt: Date;

  @Property({ type: DateTimeType, onUpdate: () => new Date() })
  declare updatedAt: Date;
}
