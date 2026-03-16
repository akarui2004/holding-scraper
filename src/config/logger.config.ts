import { ILoggerConfig, ILoggerFormatType } from '@types';
import { getConfig } from '@config';

export class LoggerConfig implements ILoggerConfig {
  public readonly level: string;
  public readonly format: 'pretty' | 'json';
  public readonly output_dir: string;
  public readonly rotate: string;
  public readonly max_size: string;
  public readonly max_files: number;

  public constructor() {
    const loggerConfig = getConfig('logger') as Record<string, string | number>;
    this.level = (loggerConfig.level as string) || 'info';
    this.format = (loggerConfig.format as ILoggerFormatType) || 'pretty';
    this.output_dir = (loggerConfig.output_dir as string) || 'logs';
    this.rotate = (loggerConfig.rotate as string) || 'daily';
    this.max_size = (loggerConfig.max_size as string) || '10m';
    this.max_files = (loggerConfig.max_files as number) || 5;
  }

  public get isPretty(): boolean {
    return this.format === 'pretty';
  }
}
