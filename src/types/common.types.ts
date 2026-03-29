import { Environment } from '@enums';

export type IEnvironment = (typeof Environment)[keyof typeof Environment];

export interface IRouteLayer {
  route?: { path: string; methods: Record<string, boolean> };
  name?: string;
  handle?: unknown;
  regexp?: RegExp;
  keys?: { name: string }[];
  params?: Record<string, string>;
}
