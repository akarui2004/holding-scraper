import {
  AppConfigSchema,
  DbConfigSchema,
  LoggerConfigSchema,
  RedisConfigSchema,
  SecurityConfigSchema,
} from '../config/schemas';
import { z } from 'zod';

export type IConfigValue = string | number | boolean | null | IConfigArray | IConfigObject;

export type IConfigArray = IConfigValue[];

export interface IConfigObject {
  [key: string]: IConfigValue;
}

export type IDbConfig = z.infer<typeof DbConfigSchema>;

export type IAppConfig = z.infer<typeof AppConfigSchema>;

export type IRedisConfig = z.infer<typeof RedisConfigSchema>;

export type ILoggerFormatType = z.infer<typeof LoggerConfigSchema>['format'];

export type ILoggerConfig = z.infer<typeof LoggerConfigSchema>;

export type ISecurityConfig = z.infer<typeof SecurityConfigSchema>;
