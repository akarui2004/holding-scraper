import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'accounts' })
export class AccountEntity extends BaseEntity {
  @Property({ type: 'varchar', length: 255 })
  name!: string;

  @Property({ type: 'varchar', length: 255, unique: true })
  domain!: string;

  @Property({ type: 'varchar', length: 50, default: 'active' })
  status!: 'active' | 'inactive';

  @Property({ type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
