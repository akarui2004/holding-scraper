import { LoggerConfig } from '@config';
import pino, { Logger, LoggerOptions, TransportTargetOptions } from 'pino';

export class LoggerUtils {
  private static instance: LoggerUtils;
  private readonly logger: Logger;
  private readonly loggerConfig: LoggerConfig;
  private readonly context?: string;

  private constructor(context?: string, parentLogger?: Logger) {
    this.loggerConfig = new LoggerConfig();
    this.context = context;

    if (parentLogger) {
      // Reuse existing transport workers via child logger — no new worker threads spawned
      this.logger = context ? parentLogger.child({ context }) : parentLogger;
    } else {
      const options: LoggerOptions = {
        level: this.loggerConfig.level,
        timestamp: pino.stdTimeFunctions.isoTime,
      };
      this.logger = pino({ ...options, transport: { targets: this.buildTransportTargets() } });
    }
  }

  /**
   * Get the singleton root logger. Context param is only used on first call.
   */
  public static getInstance(context?: string): LoggerUtils {
    if (!LoggerUtils.instance) {
      LoggerUtils.instance = new LoggerUtils(context);
    }
    return LoggerUtils.instance;
  }

  /**
   * Create a context logger that shares the singleton's transport workers.
   * Prefer this over constructing a new LoggerUtils to avoid spawning extra threads.
   */
  public static createContextLogger(context: string): LoggerUtils {
    return new LoggerUtils(context, LoggerUtils.getInstance().logger);
  }

  private buildTransportTargets(): Array<TransportTargetOptions> {
    const targets: Array<TransportTargetOptions> = [];

    // File transport with rotation — pino-roll handles size/frequency/retention
    targets.push({
      target: 'pino-roll',
      options: {
        file: `${this.loggerConfig.output_dir}/app.log`,
        frequency: this.loggerConfig.rotate,
        size: this.loggerConfig.max_size,
        dateFormat: 'yyyy-MM-dd',
        mkdir: true,
        limit: {
          count: this.loggerConfig.max_files,
          removeOtherLogFiles: true,
        },
      },
    });

    if (this.loggerConfig.isPretty) {
      // Terminal transport: "[yyyy-mm-dd HH:MM:ss] LEVEL: message {json}"
      targets.push({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
          singleLine: true,
        },
      });
    }

    return targets;
  }

  /** Build the merging object for pino's (merging, message) call signature. */
  private buildMerging(data?: Record<string, unknown>): Record<string, unknown> {
    const merging: Record<string, unknown> = {};
    if (this.context) merging.context = this.context;
    if (data) Object.assign(merging, data);
    return merging;
  }

  /** Build merging object with serialized error fields included. */
  private buildErrorMerging(
    error?: unknown,
    data?: Record<string, unknown>
  ): Record<string, unknown> {
    const merging = this.buildMerging(data);
    if (error instanceof Error) {
      merging.error = error.message;
      merging.stack = error.stack;
    } else if (error !== undefined && error instanceof Object) {
      merging.error = JSON.stringify(error);
    } else if (error !== undefined && error instanceof String) {
      merging.error = String(error);
    }
    return merging;
  }

  public info(message: string, data?: Record<string, unknown>): void {
    this.logger.info(this.buildMerging(data), message);
  }

  public error(message: string, error?: unknown, data?: Record<string, unknown>): void {
    this.logger.error(this.buildErrorMerging(error, data), message);
  }

  public warn(message: string, data?: Record<string, unknown>): void {
    this.logger.warn(this.buildMerging(data), message);
  }

  public debug(message: string, data?: Record<string, unknown>): void {
    this.logger.debug(this.buildMerging(data), message);
  }

  public trace(message: string, data?: Record<string, unknown>): void {
    this.logger.trace(this.buildMerging(data), message);
  }

  public fatal(message: string, error?: unknown, data?: Record<string, unknown>): void {
    this.logger.fatal(this.buildErrorMerging(error, data), message);
  }

  /** Returns a raw pino child logger. Use createContextLogger() for a full LoggerUtils wrapper. */
  public child(bindings: Record<string, unknown>): Logger {
    return this.logger.child(bindings);
  }
}

export const logger = LoggerUtils.getInstance();
export const createContextLogger = (context: string): LoggerUtils =>
  LoggerUtils.createContextLogger(context);
