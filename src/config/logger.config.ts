import { ILoggerConfig, ILoggerFormatType } from '@types';
import { LoggerConfigSchema } from './schemas';
import { getConfig } from './config.loader';

export class LoggerConfig implements ILoggerConfig {
  public readonly level: string;
  public readonly format: ILoggerFormatType;
  public readonly output_dir: string;
  public readonly rotate: string;
  public readonly max_size: string;
  public readonly max_files: number;

  public constructor() {
    const loggerConfig = getConfig('logger') ?? {};
    const parsedLoggerConfig = LoggerConfigSchema.parse(loggerConfig);
    this.level = parsedLoggerConfig.level;
    this.format = parsedLoggerConfig.format;
    this.output_dir = parsedLoggerConfig.output_dir;
    this.rotate = parsedLoggerConfig.rotate;
    this.max_size = parsedLoggerConfig.max_size;
    this.max_files = parsedLoggerConfig.max_files;
  }

  public get isPretty(): boolean {
    return this.format === 'pretty';
  }
}
