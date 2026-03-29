import { IAppConfig } from '@types';
import { AppConfigSchema } from './schemas';
import { getConfig } from './config.loader';

export class AppConfig implements IAppConfig {
  public readonly name: string;
  public readonly version: string;
  public readonly port: number;
  public readonly host: string;

  public constructor() {
    const appConfig = getConfig('app') ?? {};
    const parsedAppConfig = AppConfigSchema.parse(appConfig);
    this.name = parsedAppConfig.name;
    this.version = parsedAppConfig.version;
    this.port = parsedAppConfig.port;
    this.host = parsedAppConfig.host;
  }
}
