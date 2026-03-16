import { IEnvironment } from './common.types';

export type IConfigValue = string | number | boolean | null | IConfigArray | IConfigObject;

export type IConfigArray = IConfigValue[];

export interface IConfigObject {
  [key: string]: IConfigValue;
}

export interface IDbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  pool_min: number;
  pool_max: number;
  debug: boolean;
}

export interface IAppConfig {
  name: string;
  version: string;
  env: IEnvironment;
  port: number;
  host: string;
}

export interface IRedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
  key_prefix: string;
  ttl: number;
}
