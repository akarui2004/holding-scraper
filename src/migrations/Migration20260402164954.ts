// this file was generated via custom migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20260402164954 extends Migration {

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

    this.addSql(`CREATE TABLE "permissions" (
                   "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
                   "account_id" UUID NOT NULL,
                   "name" VARCHAR(255) NOT NULL,
                   "code" VARCHAR(255) NOT NULL,
                   "description" TEXT NULL,
                   "deleted_at" TIMESTAMPTZ NULL,
                   "created_at" TIMESTAMPTZ NOT NULL,
                   "updated_at" TIMESTAMPTZ NOT NULL,
                   PRIMARY KEY ("id")
                 );`);
    this.addSql(`ALTER TABLE "permissions"
                 ADD CONSTRAINT "permissions_name_unique" UNIQUE ("name");`);
    this.addSql(`ALTER TABLE "permissions"
                 ADD CONSTRAINT "permissions_code_unique" UNIQUE ("code");`);

    this.addSql(`CREATE TABLE "roles" (
                   "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
                   "account_id" UUID NOT NULL,
                   "name" VARCHAR(255) NOT NULL,
                   "code" VARCHAR(255) NOT NULL,
                   "description" TEXT NULL,
                   "deleted_at" TIMESTAMPTZ NULL,
                   "created_at" TIMESTAMPTZ NOT NULL,
                   "updated_at" TIMESTAMPTZ NOT NULL,
                   PRIMARY KEY ("id")
                 );`);
    this.addSql(`ALTER TABLE "roles"
                 ADD CONSTRAINT "roles_name_unique" UNIQUE ("name");`);
    this.addSql(`ALTER TABLE "roles"
                 ADD CONSTRAINT "roles_code_unique" UNIQUE ("code");`);

    this.addSql(`CREATE TABLE "operators" (
                   "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
                   "account_id" UUID NOT NULL,
                   "role_id" UUID NOT NULL,
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

    this.addSql(`CREATE TABLE "roles_permissions" (
                   "roles_id" UUID NOT NULL,
                   "permissions_id" UUID NOT NULL,
                   PRIMARY KEY ("roles_id", "permissions_id")
                 );`);

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

    this.addSql(`CREATE TABLE "credentials" (
                   "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
                   "account_id" UUID NOT NULL,
                   "ownerId" UUID NOT NULL,
                   "access_key" VARCHAR(255) NOT NULL,
                   "secret" VARCHAR(255) NOT NULL,
                   "owner_type" VARCHAR(128) NOT NULL,
                   "owner_id" UUID NOT NULL,
                   "type" VARCHAR(128) NOT NULL,
                   "deleted_at" TIMESTAMPTZ NULL,
                   "created_at" TIMESTAMPTZ NOT NULL,
                   "updated_at" TIMESTAMPTZ NOT NULL,
                   PRIMARY KEY ("id")
                 );`);
    this.addSql(`CREATE INDEX "idx_access_key_type" ON "credentials" ("account_id", "access_key", "type");`);
    this.addSql(`ALTER TABLE "credentials"
                 ADD CONSTRAINT "uniq_access_key_account_owner_type" UNIQUE (
                   "access_key",
                   "account_id",
                   "owner_type",
                   "owner_id"
                 );`);

    this.addSql(`ALTER TABLE "permissions"
                 ADD CONSTRAINT "permissions_account_id_foreign" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");`);

    this.addSql(`ALTER TABLE "roles"
                 ADD CONSTRAINT "roles_account_id_foreign" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");`);

    this.addSql(`ALTER TABLE "operators"
                 ADD CONSTRAINT "operators_account_id_foreign" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");`);
    this.addSql(`ALTER TABLE "operators"
                 ADD CONSTRAINT "operators_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "roles" ("id");`);

    this.addSql(`ALTER TABLE "roles_permissions"
                 ADD CONSTRAINT "roles_permissions_roles_id_foreign" FOREIGN KEY ("roles_id") REFERENCES "roles" ("id") ON UPDATE CASCADE ON DELETE CASCADE;`);
    this.addSql(`ALTER TABLE "roles_permissions"
                 ADD CONSTRAINT "roles_permissions_permissions_id_foreign" FOREIGN KEY ("permissions_id") REFERENCES "permissions" ("id") ON UPDATE CASCADE ON DELETE CASCADE;`);

    this.addSql(`ALTER TABLE "users"
                 ADD CONSTRAINT "users_account_id_foreign" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");`);

    this.addSql(`ALTER TABLE "credentials"
                 ADD CONSTRAINT "credentials_account_id_foreign" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");`);
    this.addSql(`ALTER TABLE "credentials"
                 ADD CONSTRAINT "credentials_ownerId_foreign" FOREIGN KEY ("ownerId") REFERENCES "users" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`ALTER TABLE "permissions"
                 DROP CONSTRAINT "permissions_account_id_foreign";`);
    this.addSql(`ALTER TABLE "roles"
                 DROP CONSTRAINT "roles_account_id_foreign";`);
    this.addSql(`ALTER TABLE "operators"
                 DROP CONSTRAINT "operators_account_id_foreign";`);
    this.addSql(`ALTER TABLE "users"
                 DROP CONSTRAINT "users_account_id_foreign";`);
    this.addSql(`ALTER TABLE "credentials"
                 DROP CONSTRAINT "credentials_account_id_foreign";`);
    this.addSql(`ALTER TABLE "roles_permissions"
                 DROP CONSTRAINT "roles_permissions_permissions_id_foreign";`);
    this.addSql(`ALTER TABLE "operators"
                 DROP CONSTRAINT "operators_role_id_foreign";`);
    this.addSql(`ALTER TABLE "roles_permissions"
                 DROP CONSTRAINT "roles_permissions_roles_id_foreign";`);
    this.addSql(`ALTER TABLE "credentials"
                 DROP CONSTRAINT "credentials_ownerId_foreign";`);

    this.addSql(`DROP TABLE IF EXISTS "accounts" CASCADE;`);
    this.addSql(`DROP TABLE IF EXISTS "permissions" CASCADE;`);
    this.addSql(`DROP TABLE IF EXISTS "roles" CASCADE;`);
    this.addSql(`DROP TABLE IF EXISTS "operators" CASCADE;`);
    this.addSql(`DROP TABLE IF EXISTS "roles_permissions" CASCADE;`);
    this.addSql(`DROP TABLE IF EXISTS "users" CASCADE;`);
    this.addSql(`DROP TABLE IF EXISTS "credentials" CASCADE;`);
  }

}
