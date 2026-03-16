import { getConfig } from '@config';
import { IRedisConfig } from '@types';

export class RedisConfig implements IRedisConfig {
  public readonly host: string;
  public readonly port: number;
  public readonly password: string;
  public readonly db: number;
  public readonly key_prefix: string;
  public readonly ttl: number;

  public constructor() {
    const redisConfig = getConfig('redis') as Record<string, string | number>;
    this.host = (redisConfig.host as string) || 'localhost';
    this.port = (redisConfig.port as number) || 6379;
    this.password = (redisConfig.password as string) || '';
    this.db = (redisConfig.db as number) || 0;
    this.key_prefix = (redisConfig.key_prefix as string) || 'app:';
    this.ttl = (redisConfig.ttl as number) || 3600; // Default TTL of 1 hour
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
