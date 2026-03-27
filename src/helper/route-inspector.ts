import { IRouteLayer } from '@types';
import { getEnvironment, LoggerUtils } from '@utils';
import { Express } from 'express';

interface AppRouterStack {
  stack?: IRouteLayer[];
}

interface AppRouter {
  router?: AppRouterStack;
}

class RouteInspector {
  private readonly logger: LoggerUtils;
  private static routeInspector: RouteInspector;
  public static readonly MOUNT_PATH_MAP: Record<number, string> = {
    0: '/api',
    1: '/web',
    2: '/ops',
  };

  private constructor() {
    this.logger = LoggerUtils.createContextLogger('RouteInspector');
  }

  public static getInstance(): RouteInspector {
    if (!RouteInspector.routeInspector) {
      RouteInspector.routeInspector = new RouteInspector();
    }

    return RouteInspector.routeInspector;
  }

  public logRoutes(app: Express): void {
    if (getEnvironment() === 'production') {
      this.logger.info('Route logging is only enabled in development | staging environment');
      return;
    }

    this.logger.info('=== Registered Routes ===');

    // Get the main router
    const appRouter = app as unknown as AppRouter;
    const mainRouter = appRouter.router;

    if (!mainRouter?.stack) {
      this.logger.info('No routes found');
      return;
    }

    // Find the mounted router (the one with name='router')
    const mountedRouter = mainRouter.stack.find((l) => l.name === 'router' && l.handle);

    if (!mountedRouter) {
      this.logger.info('No mounted router found');
      return;
    }

    // In Express 5, layer.handle IS the router function with .stack property
    const handleFn = mountedRouter.handle as Record<string, unknown>;
    const mountedRouterStack = handleFn.stack as IRouteLayer[] | undefined;

    if (!mountedRouterStack) {
      this.logger.info('No mounted router stack found');
      return;
    }

    // Process each mounted router (/api, /web, /ops)
    for (let i = 0; i < mountedRouterStack.length; i++) {
      const layer = mountedRouterStack[i];
      if (!layer || layer.name !== 'router' || !layer.handle) continue;

      const prefix = RouteInspector.MOUNT_PATH_MAP[i] || '';
      const layerHandle = layer.handle as Record<string, unknown>;

      // Express 5: layer.handle IS the router function with .stack directly
      const innerStack = layerHandle.stack as IRouteLayer[] | undefined;

      if (!innerStack) continue;

      // Process routes in this inner router
      for (const routeLayer of innerStack) {
        if (!routeLayer) continue;

        if (routeLayer.name === 'router' && routeLayer.handle) {
          // Second level nested router
          const nestedHandle = routeLayer.handle as Record<string, unknown>;
          const nestedStack = nestedHandle.stack as IRouteLayer[] | undefined;

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
                this.logger.info(`${method} ${nestedPrefix}${nl.route.path}`);
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
            this.logger.info(`${method} ${prefix}${route.path}`);
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
          this.logger.info(`${method} ${route.path}`);
        }
      }
    }

    this.logger.info('=== End of Routes ===');
  }
}

export const routeInspectorHelper = RouteInspector.getInstance();
