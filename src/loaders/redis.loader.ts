import { RedisConfig } from '@config';
import { LoggerUtils } from '@utils';
import Redis from 'ioredis';

export class RedisConnection {
  private static instance: RedisConnection;
  private client: Redis | null = null;
  private connectingPromise: Promise<Redis> | null = null;
  private readonly logger: LoggerUtils;
  private readonly redisConfig: RedisConfig;

  private constructor() {
    this.logger = LoggerUtils.createContextLogger('RedisConnection');
    this.redisConfig = new RedisConfig();
  }

  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }
    return RedisConnection.instance;
  }

  public async connect(): Promise<Redis> {
    if (this.client) {
      return this.client;
    }

    // Return the existing in-flight promise if already connecting
    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    this.connectingPromise = this._initClient().finally(() => {
      this.connectingPromise = null;
    });

    return this.connectingPromise;
  }

  private _initClient(): Promise<Redis> {
    const connectionOptions = this.redisConfig.getConnectionOptions();

    const client = new Redis({
      ...connectionOptions,
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    });

    client.on('connect', () => {
      this.logger.info('Redis connection established', {
        host: this.redisConfig.host,
        port: this.redisConfig.port,
        db: this.redisConfig.db,
      });
    });

    client.on('error', (error) => {
      this.logger.error('Redis connection error', error instanceof Error ? error : undefined);
    });

    client.on('close', () => {
      this.logger.info('Redis connection closed');
    });

    client.on('reconnecting', ({ attempt, delay }: { attempt: number; delay: number }) => {
      this.logger.warn(`Redis reconnecting... Attempt: ${attempt}, delay: ${delay}ms`);
    });

    // Resolve only when the connection is fully ready
    return new Promise<Redis>((resolve, reject) => {
      client.once('ready', () => {
        this.client = client;
        resolve(client);
      });

      client.once('error', reject);
    });
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.logger.info('Redis disconnected successfully');
    }
  }

  public getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis not connected. Call connect() first.');
    }
    return this.client;
  }

  public healthCheck(): boolean {
    return this.client !== null && this.client.status === 'ready';
  }
}

export const getRedis = (): RedisConnection => RedisConnection.getInstance();
