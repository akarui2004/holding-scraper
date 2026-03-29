import { defineConfig } from '@mikro-orm/core';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { DbConfig } from './config/db.config';

const dbConfig = new DbConfig();

export default defineConfig({
  // -----------
  // 1. Database Connection
  // -----------
  driver: PostgreSqlDriver,

  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.username,
  password: dbConfig.password,
  dbName: dbConfig.name,

  // -----------
  // 2. Entity Discovery
  // -----------
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],

  // -----------
  // 3. Extensions
  // -----------
  extensions: [Migrator, SeedManager],

  // -----------
  // 4. Migrations
  // -----------
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations', // Path where migration files are created
    glob: '!(*.d).{js,ts}', // Ensure type definition files are ignored
    transactional: true, // Wrap migrations in transactions
    disableForeignKeys: true, // Disable FK checks while migrating (speed + safety)
    allOrNothing: true, // Run all migrations in one transaction
  },

  // -----------
  // 5. Development / Debugging
  // -----------
  debug: dbConfig.debug,
  highlighter: new SqlHighlighter(),

  // -----------
  // 6. Core Behavior
  // -----------
  metadataProvider: ReflectMetadataProvider,

  // -----------
  // 7. Schema Generator Options
  // -----------
  schemaGenerator: {
    createForeignKeyConstraints: true, // Ensure FK constraints are created in the schema
  },
});
