import { AppConfig, SecurityConfig } from '@config';
import mainRouter from '@routes';
import { LoggerUtils } from '@utils';
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Server } from 'http';
import { DatabaseConnection } from './database.loader';
import { RedisConnection } from './redis.loader';

export class AppLoader {
  private static instance: AppLoader;
  private readonly appConfig: AppConfig = new AppConfig();
  private readonly securityConfig: SecurityConfig = new SecurityConfig();
  private app: Express;
  private server: Server | null = null;
  private readonly logger: LoggerUtils;

  private constructor() {
    this.logger = LoggerUtils.createContextLogger('AppLoader');
    this.app = express();
  }

  public static getInstance(): AppLoader {
    if (!AppLoader.instance) {
      AppLoader.instance = new AppLoader();
    }
    return AppLoader.instance;
  }

  public getApp(): Express {
    return this.app;
  }

  public initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.securityConfig.rate_limit_window_ms,
      max: this.securityConfig.rate_limit_max_requests,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (_req, res) => {
        res.status(429).json({
          success: false,
          error: 'Too many requests, please try again later.',
        });
      },
    });
    this.app.use(limiter);

    this.logger.info('Middlewares initialized');
  }

  public initializeRoutes(): void {
    // Health check endpoint (must be before mainRouter to avoid shadowing)
    this.app.get('/health', async (_req, res) => {
      const dbHealth = await DatabaseConnection.getInstance().healthCheck();
      const redisHealth = RedisConnection.getInstance().healthCheck();

      res.status(dbHealth && redisHealth ? 200 : 503).json({
        status: dbHealth && redisHealth ? 'healthy' : 'unhealthy',
        services: {
          database: dbHealth ? 'connected' : 'disconnected',
          redis: redisHealth ? 'connected' : 'disconnected',
        },
        timestamp: new Date().toISOString(),
      });
    });

    this.app.use(mainRouter);

    // 404 handler (should be last)
    this.app.use((_req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
      });
    });

    this.logger.info('Routes initialized');
  }

  public initializeErrorHandling(): void {
    this.app.use(
      (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        this.logger.error('Unhandled error', err);

        res.status(500).json({
          success: false,
          error: this.appConfig.isProduction ? 'Internal server error' : err.message,
        });
      }
    );

    this.logger.info('Error handling initialized');
  }

  public async initializeConnections(): Promise<void> {
    await DatabaseConnection.getInstance().connect();
    await RedisConnection.getInstance().connect();
    this.logger.info('All connections established');
  }

  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = this.app.listen(this.appConfig.port, this.appConfig.host, () => {
        this.server = server;
        this.logger.info(`Server started`, {
          host: this.appConfig.host,
          port: this.appConfig.port,
          environment: this.appConfig.env,
        });
        resolve();
      });
      server.once('error', reject);
    });
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down application...');

    // Stop accepting new connections before disconnecting services
    const { server } = this;
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    }

    await DatabaseConnection.getInstance().disconnect();
    await RedisConnection.getInstance().disconnect();
    this.logger.info('Application shutdown complete');
  }
}

export const getAppLoader = (): AppLoader => AppLoader.getInstance();
