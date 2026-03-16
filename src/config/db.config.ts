import { IDbConfig } from '@types';
import { getConfig } from '@config';

export class DbConfig implements IDbConfig {
  public readonly host: string;
  public readonly port: number;
  public readonly username: string;
  public readonly password: string;
  public readonly name: string;
  public readonly pool_min: number;
  public readonly pool_max: number;
  public readonly debug: boolean;

  /** Constructor to initialize database configuration from the loaded config */
  public constructor() {
    const dbConfig = getConfig('db') as Record<string, string | number | boolean>;
    this.host = (dbConfig.host as string) || 'localhost';
    this.port = (dbConfig.port as number) || 5432;
    this.username = (dbConfig.username as string) || 'postgres';
    this.password = (dbConfig.password as string) || 'password';
    this.name = (dbConfig.name as string) || 'app_db';
    this.pool_min = (dbConfig.pool_min as number) || 0;
    this.pool_max = (dbConfig.pool_max as number) || 10;
    this.debug = (dbConfig.debug as boolean) || false;
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
      pool: {
        min: this.pool_min,
        max: this.pool_max,
      },
    };
  }
}
