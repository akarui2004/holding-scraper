import { logger } from '@utils';
import { getAppLoader } from './loaders/app.loader';

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}, starting graceful shutdown`);
  try {
    await getAppLoader().shutdown();
    process.exit(0);
  } catch (err) {
    logger.error('Graceful shutdown failed', err as Error);
    process.exit(1);
  }
}

async function bootstrap() {
  const appLoader = getAppLoader();

  // Order matters: middlewares → routes → error handling → connections → start
  appLoader.initializeMiddlewares();
  appLoader.initializeRoutes();
  appLoader.initializeErrorHandling();

  // Establish connections for database and redis
  await appLoader.initializeConnections();

  await appLoader.start();

  process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', reason as Error);
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', err);
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  logger.error('Bootstrap failed', err instanceof Error ? err : new Error(String(err)));
  process.exit(1);
});
