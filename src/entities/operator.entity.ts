import { Status } from '@enums';
import { Collection, DateTimeType, StringType, TextType } from '@mikro-orm/core';
import {
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { AccountEntity } from './account.entity';
import { BaseEntity } from './base.entity';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

@Entity({ tableName: 'operators' })
@Unique({ properties: ['accessKey', 'account'], name: 'uniq_ops_access_key_account' })
@Unique({ properties: ['email', 'account'], name: 'uniq_ops_email_account' })
@Index({ properties: ['account', 'accessKey', 'status'], name: 'idx_ops_access_key_status' })
export class OperatorEntity extends BaseEntity {
  @ManyToOne(() => AccountEntity)
  account!: AccountEntity;

  @ManyToOne(() => RoleEntity)
  role!: RoleEntity;

  @Property({ type: StringType, length: 255 })
  accessKey!: string;

  @Property({ type: StringType, length: 255 })
  secret!: string;

  @Property({ type: StringType, length: 255 })
  firstName!: string;

  @Property({ type: StringType, length: 255 })
  lastName!: string;

  @Property({ type: StringType, length: 255 })
  email!: string;

  @Property({ type: StringType, length: 32, nullable: true })
  phoneNumber!: string | null;

  @Property({ type: TextType, nullable: true })
  address!: string | null;

  @Property({ type: StringType, length: 32 })
  status!: Status;

  @Property({ type: DateTimeType, nullable: true })
  deletedAt!: Date | null;

  @Property({ type: DateTimeType, onCreate: () => new Date() })
  declare createdAt: Date;

  @Property({ type: DateTimeType, onCreate: () => new Date(), onUpdate: () => new Date() })
  declare updatedAt: Date;

  @ManyToMany(() => PermissionEntity)
  permissions!: Collection<PermissionEntity>;
}
