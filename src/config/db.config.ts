import { IDbConfig } from '@types';
import z from 'zod';
import { getConfig } from './config.loader';

export const DbConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(5432),
  username: z.string().default('postgres'),
  password: z.string().default('password'),
  name: z.string().default('app_db'),
  pool_min: z.coerce.number().default(0),
  pool_max: z.coerce.number().default(10),
  debug: z.boolean().default(false),
});

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
    const dbConfig = getConfig('db') ?? {};
    const parsedDbConfig = DbConfigSchema.parse(dbConfig);
    this.host = parsedDbConfig.host;
    this.port = parsedDbConfig.port;
    this.username = parsedDbConfig.username;
    this.password = parsedDbConfig.password;
    this.name = parsedDbConfig.name;
    this.pool_min = parsedDbConfig.pool_min;
    this.pool_max = parsedDbConfig.pool_max;
    this.debug = parsedDbConfig.debug;
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
