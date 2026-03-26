import { Express } from 'express';
import { RouteLayer } from '@types';
import { LoggerUtils } from './logger';

// Map based on route order - Express 5 doesn't store mount paths
const MOUNT_PATH_MAP: Record<number, string> = {
  0: '/api',
  1: '/web',
  2: '/ops',
};

export function logRoutes(app: Express): void {
  const logger = LoggerUtils.createContextLogger('RouteLogger');

  logger.info('=== Registered Routes ===');

  // Get the main router
  const appWithRouter = app as unknown as { router?: { stack?: RouteLayer[] } };
  const mainRouter = appWithRouter.router;

  if (!mainRouter?.stack) {
    logger.info('No routes found');
    return;
  }

  // Find the mounted router (the one with name='router')
  const mountedRouter = mainRouter.stack.find((l) => l.name === 'router' && l.handle);

  if (!mountedRouter) {
    logger.info('No mounted router found');
    return;
  }

  // In Express 5, layer.handle IS the router function with .stack property
  const handleFn = mountedRouter.handle as Record<string, unknown>;
  const mountedRouterStack = handleFn.stack as RouteLayer[] | undefined;

  if (!mountedRouterStack) {
    logger.info('No mounted router stack found');
    return;
  }

  // Process each mounted router (/api, /web, /ops)
  for (let i = 0; i < mountedRouterStack.length; i++) {
    const layer = mountedRouterStack[i];
    if (!layer || layer.name !== 'router' || !layer.handle) continue;

    const prefix = MOUNT_PATH_MAP[i] || '';
    const layerHandle = layer.handle as Record<string, unknown>;

    // Express 5: layer.handle IS the router function with .stack directly
    const innerStack = layerHandle.stack as RouteLayer[] | undefined;

    if (!innerStack) continue;

    // Process routes in this inner router
    for (const routeLayer of innerStack) {
      if (!routeLayer) continue;

      if (routeLayer.name === 'router' && routeLayer.handle) {
        // Second level nested router
        const nestedHandle = routeLayer.handle as Record<string, unknown>;
        const nestedStack = nestedHandle.stack as RouteLayer[] | undefined;

        if (!nestedStack) continue;

        // Determine nested prefix based on parent prefix
        let nestedPrefix = prefix;
        if (prefix === '/api') nestedPrefix = '/api/auth';
        else if (prefix === '/web') nestedPrefix = '/web/products';
        else if (prefix === '/ops') nestedPrefix = '/ops/monitoring';

        for (const nl of nestedStack) {
          if (nl?.route) {
            const method = Object.keys(nl.route.methods)
              .find((m) => m !== '_all')
              ?.toUpperCase();
            if (method) {
              logger.info(`${method} ${nestedPrefix}${nl.route.path}`);
            }
          }
        }
      } else if (routeLayer.route) {
        // Direct route on this router
        const route = routeLayer.route;
        const method = Object.keys(route.methods)
          .find((m) => m !== '_all')
          ?.toUpperCase();
        if (method) {
          logger.info(`${method} ${prefix}${route.path}`);
        }
      }
    }
  }

  // Log direct app routes (like /health)
  for (const layer of mainRouter.stack) {
    if (layer?.route) {
      const route = layer.route;
      const method = Object.keys(route.methods)
        .find((m) => m !== '_all')
        ?.toUpperCase();
      if (method) {
        logger.info(`${method} ${route.path}`);
      }
    }
  }

  logger.info('=== End Routes ===');
}
