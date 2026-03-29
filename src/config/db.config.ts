import { DbConfigSchema } from './schemas';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import { IDbConfig } from '@types';
import { getConfig } from './config.loader';

export class DbConfig implements IDbConfig {
  public readonly host: string;
  public readonly port: number;
  public readonly username: string;
  public readonly password: string;
  public readonly name: string;
  public readonly pool_min: number;
  public readonly pool_max: number;
  public readonly debug: boolean;
  public readonly discovery: {
    warn_when_no_entities: boolean;
    check_duplicate_table_name: boolean;
    check_duplicate_field_name: boolean;
    check_duplicate_entities: boolean;
  };

  /** Constructor to initialize database configuration from the loaded config */
  public constructor() {
    const dbConfig = getConfig('database') ?? {};
    const parsedDbConfig = DbConfigSchema.parse(dbConfig);
    this.host = parsedDbConfig.host;
    this.port = parsedDbConfig.port;
    this.username = parsedDbConfig.username;
    this.password = parsedDbConfig.password;
    this.name = parsedDbConfig.name;
    this.pool_min = parsedDbConfig.pool_min;
    this.pool_max = parsedDbConfig.pool_max;
    this.debug = parsedDbConfig.debug;
    this.discovery = parsedDbConfig.discovery;
  }

  /**
   * Returns the PostgreSQL connection string in the format
   * Eg: DatabaseConfig.connectionString => "postgresql://user:password@host:port/dbname"
   */
  public get connectionString(): string {
    return `postgresql://${this.username}:${this.password}@${this.host}:${this.port}/${this.name}`;
  }

  /**
   * Returns a configuration object suitable for MikroORM or similar ORMs that require detailed connection options.
   * Eg: DatabaseConfig.mikroOrmConfig => { ... }
   */
  public get mikroOrmConfig(): Record<string, unknown> {
    return {
      host: this.host,
      port: this.port,
      user: this.username,
      password: this.password,
      dbName: this.name,
      debug: this.debug,
      extensions: [Migrator, SeedManager],
      discovery: {
        warnWhenNoEntities: this.discovery.warn_when_no_entities,
        checkDuplicateTableName: this.discovery.check_duplicate_table_name,
        checkDuplicateFieldName: this.discovery.check_duplicate_field_name,
        checkDuplicateEntities: this.discovery.check_duplicate_entities,
      },
      entities: ['dist/entities/**/*.js'],
      entitiesTs: ['src/entities/**/*.ts'],
      migrations: {
        path: 'dist/migrations',
        pathTs: 'src/migrations',
        glob: '!(*.d).{js,ts}',
      },
      pool: {
        min: this.pool_min,
        max: this.pool_max,
      },
    };
  }
}
