import { Entity, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey({ type: 'integer', autoincrement: true })
  id!: number;

  @SerializedPrimaryKey({ unique: true })
  uuid!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor() {
    this.uuid = uuidv4();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.uuid,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
