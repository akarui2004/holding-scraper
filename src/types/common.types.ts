import { AppConfigSchema } from '@config';
import { z } from 'zod';

export type IEnvironment = z.infer<typeof AppConfigSchema>['env'];

export interface RouteLayer {
  route?: { path: string; methods: Record<string, boolean> };
  name?: string;
  handle?: unknown;
  regexp?: RegExp;
  keys?: { name: string }[];
  params?: Record<string, string>;
}
