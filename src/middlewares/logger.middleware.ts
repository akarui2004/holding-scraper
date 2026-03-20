import { LoggerUtils } from '@utils';
import { Request, Response, NextFunction } from 'express';

type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

export interface RequestLog {
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  ip: string;
  userAgent: string;
  [key: string]: string | number;
}

export class RequestLoggerMiddleware {
  private static instance: RequestLoggerMiddleware;
  private readonly logger: LoggerUtils;

  private constructor() {
    this.logger = LoggerUtils.createContextLogger('RequestLoggerMiddleware');
  }

  public static getInstance(): RequestLoggerMiddleware {
    if (!RequestLoggerMiddleware.instance) {
      RequestLoggerMiddleware.instance = new RequestLoggerMiddleware();
    }
    return RequestLoggerMiddleware.instance;
  }

  public log(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const startTime = Date.now();

      // Capture original end function
      const originalEnd = res.end.bind(res);

      // Override end function to log response
      res.end = ((...args: Parameters<typeof res.end>) => {
        const responseTime = Date.now() - startTime;

        const logData: Record<string, unknown> = {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          responseTime,
          ip: RequestLoggerMiddleware.getClientIp(req),
          userAgent: req.get('user-agent') || 'unknown',
        };

        this.logger.info('HTTP Request', logData);

        // Call original end function
        return originalEnd.apply(res, args);
      }) as typeof res.end;

      next();
    };
  }

  private static getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      const parts = forwarded.split(',');
      if (parts.length > 0 && parts[0]) {
        return parts[0].trim();
      }
    }
    if (req.ip) {
      return req.ip;
    }
    const remoteAddress = req.socket?.remoteAddress;
    if (remoteAddress) {
      return remoteAddress;
    }
    return 'unknown';
  }
}

export const requestLogger = (): RequestHandler => RequestLoggerMiddleware.getInstance().log();
