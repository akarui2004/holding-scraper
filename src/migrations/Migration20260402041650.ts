// this file was generated via custom migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20260402041650 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`CREATE TABLE "accounts" (
                   "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
                   "name" VARCHAR(255) NOT NULL,
                   "domain" VARCHAR(255) NOT NULL,
                   "status" VARCHAR(50) NOT NULL DEFAULT 'active',
                   "deleted_at" TIMESTAMPTZ NULL,
                   "created_at" TIMESTAMPTZ NOT NULL,
                   "updated_at" TIMESTAMPTZ NOT NULL,
                   PRIMARY KEY ("id")
                 );`);
    this.addSql(`ALTER TABLE "accounts"
                 ADD CONSTRAINT "accounts_domain_unique" UNIQUE ("domain");`);

    this.addSql(`CREATE TABLE "users" (
                   "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
                   "account_id" UUID NOT NULL,
                   "first_name" VARCHAR(255) NOT NULL,
                   "last_name" VARCHAR(255) NOT NULL,
                   "email" VARCHAR(255) NOT NULL,
                   "mobile_number" VARCHAR(32) NULL,
                   "address" TEXT NULL,
                   "bio" TEXT NULL,
                   "deleted_at" TIMESTAMPTZ NULL,
                   "created_at" TIMESTAMPTZ NOT NULL,
                   "updated_at" TIMESTAMPTZ NOT NULL,
                   PRIMARY KEY ("id")
                 );`);
    this.addSql(`ALTER TABLE "users"
                 ADD CONSTRAINT "uniq_email_account" UNIQUE ("email", "account_id");`);

    this.addSql(`ALTER TABLE "users"
                 ADD CONSTRAINT "users_account_id_foreign" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`ALTER TABLE "users"
                 DROP CONSTRAINT "users_account_id_foreign";`);

    this.addSql(`DROP TABLE IF EXISTS "accounts" CASCADE;`);
    this.addSql(`DROP TABLE IF EXISTS "users" CASCADE;`);
  }

}
