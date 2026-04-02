import { DateTimeType, StringType, TextType } from '@mikro-orm/core';
import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/decorators/legacy';
import { AccountEntity } from './account.entity';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'users' })
@Unique({ properties: ['email', 'account'], name: 'uniq_email_account' })
export class UserEntity extends BaseEntity {
  @ManyToOne(() => AccountEntity)
  account!: AccountEntity;

  @Property({ type: StringType, length: 255 })
  firstName!: string;

  @Property({ type: StringType, length: 255 })
  lastName!: string;

  @Property({ type: StringType, length: 255 })
  email!: string;

  @Property({ type: StringType, length: 32, nullable: true })
  mobileNumber!: string | null;

  @Property({ type: TextType, nullable: true })
  address!: string | null;

  @Property({ type: TextType, nullable: true })
  bio!: string | null;

  @Property({ type: DateTimeType, nullable: true })
  deletedAt!: Date | null;

  @Property({ type: DateTimeType })
  declare createdAt: Date;

  @Property({ type: DateTimeType, onUpdate: () => new Date() })
  declare updatedAt: Date;
}
