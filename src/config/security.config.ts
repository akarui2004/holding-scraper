import { SecurityConfigSchema } from './schemas';
import { getConfig } from './config.loader';

export class SecurityConfig {
  public readonly jwt_secret: string;
  public readonly jwt_expires_in: string;
  public readonly bcrypt_rounds: number;
  public readonly rate_limit_window_ms: number;
  public readonly rate_limit_max_requests: number;

  public constructor() {
    const securityConfig = getConfig('security') ?? {};
    const parsedSecurityConfig = SecurityConfigSchema.parse(securityConfig);
    this.jwt_secret = parsedSecurityConfig.jwt_secret;
    this.jwt_expires_in = parsedSecurityConfig.jwt_expires_in;
    this.bcrypt_rounds = parsedSecurityConfig.bcrypt_rounds;
    this.rate_limit_window_ms = parsedSecurityConfig.rate_limit_window_ms;
    this.rate_limit_max_requests = parsedSecurityConfig.rate_limit_max_requests;
  }
}
