import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import pc from 'picocolors';
import { DbConfig } from '../src/config/db.config';

const dropDatabase = async (): Promise<void> => {
  const dbConfig = new DbConfig();
  const maintanceDbName = 'postgres'; // Default maintenance database for PostgreSQL
  const mikroOrm = await MikroORM.init({
    driver: PostgreSqlDriver,
    dbName: maintanceDbName,
    user: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,
    entities: [], // No need to load entities for dropping the database
    discovery: {
      warnWhenNoEntities: false,
    },
  });

  try {
    // Terminate active sessions
    console.log(pc.yellow(`⚠️  Terminating active connections to database "${dbConfig.name}"...`));
    await mikroOrm.em.getConnection().execute(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '${dbConfig.name}' AND pid <> pg_backend_pid();
    `);

    // Drop database
    console.log(pc.yellow(`⚠️  Dropping database "${dbConfig.name}"...`));
    await mikroOrm.em.getConnection().execute(`DROP DATABASE IF EXISTS "${dbConfig.name}"`);

    console.log(pc.green(`✅  Database "${dbConfig.name}" dropped successfully.`));
  } finally {
    await mikroOrm.close(true);
  }
}

dropDatabase().catch((error) => {
  console.error(pc.red(`❌  Failed to drop database: ${error.message}`));
  process.exit(1);
});