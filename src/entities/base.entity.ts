import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'timestamptz' })
  createdAt!: Date;

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt!: Date;

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
