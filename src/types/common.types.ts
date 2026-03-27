export type IEnvironment = 'development' | 'staging' | 'production' | 'test';

export interface IRouteLayer {
  route?: { path: string; methods: Record<string, boolean> };
  name?: string;
  handle?: unknown;
  regexp?: RegExp;
  keys?: { name: string }[];
  params?: Record<string, string>;
}
