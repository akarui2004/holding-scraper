import { LoggerConfig } from '@config';
import pino, { Logger, LoggerOptions, TransportTargetOptions } from 'pino';

export class LoggerUtils {
  private static instance: LoggerUtils;
  private readonly logger: Logger;
  private readonly loggerConfig: LoggerConfig;
  private readonly context?: string;

  private constructor(context?: string) {
    this.loggerConfig = new LoggerConfig();
    const options: LoggerOptions = {
      level: this.loggerConfig.level,
      timestamp: pino.stdTimeFunctions.isoTime,
    };
    this.logger = pino({ ...options, transport: { targets: this.loggerMultiTargets() } });

    this.context = context;
  }

  /**
   * Get the singleton instance of LoggerUtils. If a context is provided, it will be used for the logger instance.
   * If an instance already exists, the context will be ignored and the existing instance will be returned.
   * @param context The context to associate with the logger instance.
   * @returns The singleton instance of LoggerUtils.
   */
  public static getInstance(context?: string): LoggerUtils {
    if (!LoggerUtils.instance) {
      LoggerUtils.instance = new LoggerUtils(context);
    }

    return LoggerUtils.instance;
  }

  /**
   * Create a new LoggerUtils instance with a specific context. This allows you to have separate loggers for different parts of your application, each with its own context.
   * @param context The context to associate with the new logger instance.
   * @returns A new LoggerUtils instance with the specified context.
   */
  public static createContextLogger(context: string): LoggerUtils {
    return new LoggerUtils(context);
  }

  /**
   * Configure the logger transports based on the logger configuration. This method sets up the file transport with log rotation and optionally adds a pretty-print transport for console output.
   * @returns An array of transport target options for the logger configuration.
   */
  private loggerMultiTargets() {
    const targets: Array<TransportTargetOptions> = [];

    targets.push({
      target: 'pino-roll',
      options: {
        dateFormat: 'yyyy-MM-dd',
        file: `${this.loggerConfig.output_dir}/app.log`,
        frequency: this.loggerConfig.rotate,
        size: this.loggerConfig.max_size,
        limit: {
          count: this.loggerConfig.max_files,
          removeOtherLogFiles: true,
        },
      },
    });

    if (this.loggerConfig.isPretty) {
      targets.push({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      });
    }

    return targets;
  }

  /**
   * Format the log message by combining the base message with any additional data and context.
   * This method ensures that the log output is consistent and includes relevant information for debugging and monitoring.
   * @param message The main log message.
   * @param data Additional data to include in the log message.
   * @returns A formatted log message object.
   */
  private formatMessage(message: string, data?: Record<string, unknown>): Record<string, unknown> {
    const baseData: Record<string, unknown> = {};
    if (this.context) {
      baseData.context = this.context;
    }
    return { ...baseData, ...data, message };
  }

  public info(message: string, data?: Record<string, unknown>): void {
    this.logger.info(this.formatMessage(message, data));
  }

  public error(message: string, error?: Error, data?: Record<string, unknown>): void {
    const errorData: Record<string, unknown> = { ...data };
    if (error instanceof Error) {
      errorData.error = error.message;
      errorData.stack = error.stack;
    } else if (error) {
      errorData.error = error;
    }
    this.logger.error(this.formatMessage(message, errorData));
  }

  public warn(message: string, data?: Record<string, unknown>): void {
    this.logger.warn(this.formatMessage(message, data));
  }

  public debug(message: string, data?: Record<string, unknown>): void {
    this.logger.debug(this.formatMessage(message, data));
  }

  public trace(message: string, data?: Record<string, unknown>): void {
    this.logger.trace(this.formatMessage(message, data));
  }

  public fatal(message: string, error?: Error, data?: Record<string, unknown>): void {
    const errorData: Record<string, unknown> = { ...data };
    if (error instanceof Error) {
      errorData.error = error.message;
      errorData.stack = error.stack;
    } else if (error) {
      errorData.error = error;
    }
    this.logger.fatal(this.formatMessage(message, errorData));
  }

  public child(bindings: Record<string, unknown>): Logger {
    return this.logger.child(bindings);
  }
}

export const logger = LoggerUtils.getInstance();
export const createContextLogger = (context: string): LoggerUtils =>
  LoggerUtils.createContextLogger(context);
