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
