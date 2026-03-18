import { IAppConfig, IEnvironment } from '@types';
import { z } from 'zod';
import { getConfig } from './config.loader';

export const AppConfigSchema = z.object({
  name: z.string().default('My App'),
  version: z.string().default('1.0.0'),
  env: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3000),
  host: z.string().default('localhost'),
});

export class AppConfig implements IAppConfig {
  public readonly name: string;
  public readonly version: string;
  public readonly env: IEnvironment;
  public readonly port: number;
  public readonly host: string;

  public constructor() {
    const appConfig = getConfig('app') ?? {};
    const parsedAppConfig = AppConfigSchema.parse(appConfig);
    this.name = parsedAppConfig.name;
    this.version = parsedAppConfig.version;
    this.env = parsedAppConfig.env;
    this.port = parsedAppConfig.port;
    this.host = parsedAppConfig.host;
  }

  public get isDevelopment(): boolean {
    return this.env === 'development';
  }

  public get isProduction(): boolean {
    return this.env === 'production';
  }

  public get isStaging(): boolean {
    return this.env === 'staging';
  }

  public get isTest(): boolean {
    return this.env === 'test';
  }
}
