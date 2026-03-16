import { logger } from '@utils';

console.log('Starting application...');

logger.info('Application has started successfully');
logger.debug('Debugging information: Application is running in development mode');
logger.warn('This is a warning message');
logger.error('An error occurred while processing the request', new Error('Sample error'));
logger.fatal('A fatal error occurred, shutting down the application', new Error('Fatal error'));
