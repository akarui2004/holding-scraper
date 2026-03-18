import { DbConfig } from '@config';
import { Connection, EntityManager, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/postgresql';
import { LoggerUtils } from '@utils';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private orm: MikroORM<IDatabaseDriver<Connection>> | null = null;
  private connectingPromise: Promise<MikroORM<IDatabaseDriver<Connection>>> | null = null;
  private readonly logger: LoggerUtils;

  private constructor() {
    this.logger = LoggerUtils.createContextLogger('DatabaseConnection');
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<MikroORM<IDatabaseDriver<Connection>>> {
    if (this.orm) {
      return this.orm;
    }

    // Return the existing in-flight promise if already connecting
    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    this.connectingPromise = this._initOrm().finally(() => {
      this.connectingPromise = null;
    });

    return this.connectingPromise;
  }

  private async _initOrm(): Promise<MikroORM<IDatabaseDriver<Connection>>> {
    const dbConfig = new DbConfig();
    const ormConfig = defineConfig({ ...dbConfig.mikroOrmConfig });

    try {
      this.orm = await MikroORM.init(ormConfig);
      this.logger.info('Database connected successfully');
      return this.orm;
    } catch (error) {
      this.logger.error(
        'Failed to connect to database',
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.orm) {
      await this.orm.close(true);
      this.orm = null;
      this.logger.info('Database disconnected successfully');
    }
  }

  public getOrm(): MikroORM<IDatabaseDriver<Connection>> {
    if (!this.orm) {
      throw new Error('Database not connected. Call connect() method first.');
    }

    return this.orm;
  }

  public getEntityManager(): EntityManager<IDatabaseDriver<Connection>> {
    return this.getOrm().em;
  }

  public async runMigrations(): Promise<void> {
    await this.getOrm().migrator.up();
    this.logger.info('Migrations applied successfully');
  }

  public async rollbackMigrations(): Promise<void> {
    await this.getOrm().migrator.down();
    this.logger.info('Migrations rolled back successfully');
  }

  public async createMigration(name: string): Promise<void> {
    await this.getOrm().migrator.create(name);
    this.logger.info(`Migration ${name} created successfully`);
  }

  public async healthCheck(): Promise<boolean> {
    if (!this.orm) {
      return false;
    }

    try {
      const conn = this.orm.em.getConnection();
      await conn.execute('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}

export const getDatabase = (): DatabaseConnection => DatabaseConnection.getInstance();
