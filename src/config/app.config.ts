import { IAppConfig } from '@types';
import { z } from 'zod';
import { getConfig } from './config.loader';

export const AppConfigSchema = z.object({
  name: z.string().default('My App'),
  version: z.string().default('1.0.0'),
  port: z.coerce.number().default(3000),
  host: z.string().default('localhost'),
});

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
