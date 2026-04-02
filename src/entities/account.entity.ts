import { Status } from '@enums';
import { Collection, DateTimeType, StringType } from '@mikro-orm/core';
import { Entity, OneToMany, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './base.entity';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'accounts' })
export class AccountEntity extends BaseEntity {
  @Property({ type: StringType, length: 255 })
  name!: string;

  @Property({ type: StringType, length: 255, unique: true })
  domain!: string;

  @Property({ type: StringType, length: 50, default: Status.Active })
  status!: Status;

  @Property({ type: DateTimeType, nullable: true })
  deletedAt!: Date | null;

  @Property({ type: DateTimeType })
  declare createdAt: Date;

  @Property({ type: DateTimeType, onUpdate: () => new Date() })
  declare updatedAt: Date;

  @OneToMany(() => UserEntity, (user) => user.account, { eager: true })
  users!: Collection<UserEntity>;

  @OneToMany(() => RoleEntity, (role) => role.account, { eager: true })
  roles!: Collection<RoleEntity>;

  @OneToMany(() => PermissionEntity, (permission) => permission.account, { eager: true })
  permissions!: Collection<PermissionEntity>;
}
