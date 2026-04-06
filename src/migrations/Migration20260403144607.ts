// this file was generated via custom migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20260403144607 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`CREATE TABLE "operators_permissions" (
                   "operators_id" UUID NOT NULL,
                   "permissions_id" UUID NOT NULL,
                   PRIMARY KEY ("operators_id", "permissions_id")
                 );`);

    this.addSql(`ALTER TABLE "operators_permissions"
                 ADD CONSTRAINT "operators_permissions_operators_id_foreign" FOREIGN KEY ("operators_id") REFERENCES "operators" ("id") ON UPDATE CASCADE ON DELETE CASCADE;`);
    this.addSql(`ALTER TABLE "operators_permissions"
                 ADD CONSTRAINT "operators_permissions_permissions_id_foreign" FOREIGN KEY ("permissions_id") REFERENCES "permissions" ("id") ON UPDATE CASCADE ON DELETE CASCADE;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "operators_permissions" CASCADE;`);
  }

}
