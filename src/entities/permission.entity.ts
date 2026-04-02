import { Collection, DateTimeType, StringType, TextType } from '@mikro-orm/core';
import { Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { AccountEntity } from './account.entity';
import { BaseEntity } from './base.entity';
import { RoleEntity } from './role.entity';

@Entity({ tableName: 'permissions' })
// Define Unique or Index key in here
export class PermissionEntity extends BaseEntity {
  @ManyToOne(() => AccountEntity)
  account!: AccountEntity;

  @Property({ type: StringType, length: 255, unique: true })
  name!: string;

  @Property({ type: StringType, length: 255, unique: true })
  code!: string;

  @Property({ type: TextType, nullable: true })
  description!: string | null;

  @Property({ type: DateTimeType, nullable: true })
  deletedAt!: Date | null;

  @Property({ type: DateTimeType })
  declare createdAt: Date;

  @Property({ type: DateTimeType, onUpdate: () => new Date() })
  declare updatedAt: Date;

  @ManyToMany(() => RoleEntity, (role) => role.permissions, { eager: true })
  roles!: Collection<RoleEntity>;
}
