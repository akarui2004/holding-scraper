import { DateTimeType, UuidType } from '@mikro-orm/core';
import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

export abstract class BaseEntity {
  @PrimaryKey({ type: UuidType, defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: DateTimeType, onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: DateTimeType, onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
