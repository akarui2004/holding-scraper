import { getConfig } from './config.loader';
import z from 'zod';
import { IRedisConfig } from '@types';

export const RedisConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(6379),
  password: z.string().default(''),
  db: z.coerce.number().default(0),
  key_prefix: z.string().default('app:'),
  ttl: z.coerce.number().default(3600),
});

export class RedisConfig implements IRedisConfig {
  public readonly host: string;
  public readonly port: number;
  public readonly password: string;
  public readonly db: number;
  public readonly key_prefix: string;
  public readonly ttl: number;

  public constructor() {
    const redisConfig = getConfig('redis') ?? {};
    const parsedRedisConfig = RedisConfigSchema.parse(redisConfig);
    this.host = parsedRedisConfig.host;
    this.port = parsedRedisConfig.port;
    this.password = parsedRedisConfig.password;
    this.db = parsedRedisConfig.db;
    this.key_prefix = parsedRedisConfig.key_prefix;
    this.ttl = parsedRedisConfig.ttl;
  }

  public getConnectionOptions(): Record<string, string | number> {
    const options: Record<string, string | number> = {
      host: this.host,
      port: this.port,
      db: this.db,
    };

    if (this.password) {
      options.password = this.password;
    }

    return options;
  }

  /**
   * Get a Redis key with the configured prefix
   * @param key - The base key to prefix
   * @returns string - The prefixed Redis key
   */
  public getPrefixedKey(key: string): string {
    return `${this.key_prefix}${key}`;
  }
}
