import z from 'zod';

export const AppConfigSchema = z.object({
  name: z.string().default('My App'),
  version: z.string().default('1.0.0'),
  port: z.coerce.number().default(3000),
  host: z.string().default('localhost'),
});

export const DbConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(5432),
  username: z.string().default('postgres'),
  password: z.string().default('password'),
  name: z.string().default('app_db'),
  pool_min: z.coerce.number().default(0),
  pool_max: z.coerce.number().default(10),
  debug: z.boolean().default(false),
  discovery: z.object({
    warn_when_no_entities: z.boolean().default(false),
    check_duplicate_table_name: z.boolean().default(true),
    check_duplicate_field_name: z.boolean().default(true),
    check_duplicate_entities: z.boolean().default(true),
  }),
});

export const LoggerConfigSchema = z.object({
  level: z.string().default('info'),
  format: z.enum(['pretty', 'json']).default('pretty'),
  output_dir: z.string().default('logs'),
  rotate: z.string().default('daily'),
  max_size: z.string().default('10m'),
  max_files: z.coerce.number().default(5),
});

export const RedisConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(6379),
  password: z.string().optional(),
  db: z.coerce.number().default(0),
  key_prefix: z.string().default('app:'),
  ttl: z.coerce.number().default(3600),
});

export const SecurityConfigSchema = z.object({
  jwt_secret: z.string().min(32),
  jwt_expires_in: z.string().default('1h'),
  bcrypt_rounds: z.coerce.number().default(10),
  rate_limit_window_ms: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  rate_limit_max_requests: z.coerce.number().default(100), // 100 requests per window
});
