import { getConfig } from '@config';
import { IAppConfig, IEnvironment } from '@types';

export class AppConfig implements IAppConfig {
  public readonly name: string;
  public readonly version: string;
  public readonly env: IEnvironment;
  public readonly port: number;
  public readonly host: string;

  public constructor() {
    const appConfig = getConfig('app') as Record<string, string | number>;
    this.name = (appConfig.name as string) || 'My App';
    this.version = (appConfig.version as string) || '1.0.0';
    this.env = (appConfig.env as IEnvironment) || 'development';
    this.port = (appConfig.port as number) || 3000;
    this.host = (appConfig.host as string) || 'localhost';
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
