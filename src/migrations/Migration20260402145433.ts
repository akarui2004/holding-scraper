// this file was generated via custom migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20260402145433 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`CREATE TABLE "operators" (
                   "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
                   "account_id" UUID NOT NULL,
                   "access_key" VARCHAR(255) NOT NULL,
                   "secret" VARCHAR(255) NOT NULL,
                   "first_name" VARCHAR(255) NOT NULL,
                   "last_name" VARCHAR(255) NOT NULL,
                   "email" VARCHAR(255) NOT NULL,
                   "phone_number" VARCHAR(32) NULL,
                   "address" TEXT NULL,
                   "status" VARCHAR(32) NOT NULL,
                   "deleted_at" TIMESTAMPTZ NULL,
                   "created_at" TIMESTAMPTZ NOT NULL,
                   "updated_at" TIMESTAMPTZ NOT NULL,
                   PRIMARY KEY ("id")
                 );`);
    this.addSql(`CREATE INDEX "idx_ops_access_key_status" ON "operators" ("account_id", "access_key", "status");`);
    this.addSql(`ALTER TABLE "operators"
                 ADD CONSTRAINT "uniq_ops_email_account" UNIQUE ("email", "account_id");`);
    this.addSql(`ALTER TABLE "operators"
                 ADD CONSTRAINT "uniq_ops_access_key_account" UNIQUE ("access_key", "account_id");`);

    this.addSql(`ALTER TABLE "operators"
                 ADD CONSTRAINT "operators_account_id_foreign" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "operators" CASCADE;`);
  }

}
