// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { bool, cleanEnv, EnvError, json, makeValidator, num, port, str } from 'envalid';

const pemKeys = makeValidator((input: string): string => {
  if (typeof input === 'string' && input.length > 0 && input.startsWith('-----BEGIN ')) {
    return input.replace(/\\n/g, '\n');
  }

  throw new EnvError(`Not a valid PEM key.`);
});

const env = cleanEnv(process.env, {
  HOST: str({ default: undefined, devDefault: undefined }),
  PORT: port({ default: 3001, devDefault: 3001 }),
  APP_VERSION: str({ default: 'v0.0.0', devDefault: 'local' }),
  API_URL: str({ default: '/' }),
  FRONTEND_URL: str({ default: '/' }),
  APP_ENV: str({
    default: 'unknown',
    devDefault: 'local',
    choices: ['local', 'development', 'staging', 'production', 'preview', 'uat', 'unknown', 'ci'],
  }),

  SWAGGER_ENABLED: bool({ default: false, devDefault: true }),
  LOG_LEVEL: str({ default: 'debug', devDefault: 'verbose' }),
  CORS: bool({ default: true, devDefault: true }),
  AUTH_AUTO_REGISTRATION: bool({ default: false, devDefault: true }),

  SENTRY_DSN: str({ default: null, devDefault: null }),

  THROTTLE_TTL: num({ default: 60, devDefault: 60 }),
  THROTTLE_LIMIT: num({ default: 30, devDefault: 200 }),

  JWT_EXPIRATION_TIME: num({ default: 86400, devDefault: 86400 }),
  JWT_ISSUER: str({
    devDefault: 'development',
    default: '1811labs-backend',
  }),
  JWT_PRIVATE_KEY: pemKeys(),
  JWT_PUBLIC_KEY: pemKeys(),

  POSTGRES_URL: str(),
  POSTGRES_SSL_CA: pemKeys({ default: '', devDefault: '' }),

  ORM_LOGGING_ENABLED: json({ default: false, devDefault: false }),
  ORM_AUTO_MIGRATION: bool({ default: true, devDefault: true }),
  ORM_SYNCHRONIZE: bool({ default: false, devDefault: false }),

  S3_KEY: str(),
  S3_ENDPOINT: str(),
  S3_SECRET: str(),
  S3_BUCKET: str(),
  S3_REGION: str({ default: 'us-east-1' }),

  // ====================================================
  // Services
  // ====================================================

  /**
   * Global webhook endpoint
   */
  INTERNAL_API_TOKEN: str({ default: '', devDefault: '' }),

  /** Health check configs */
  HEALTH_MEMORY_HEAP_THRESHOLD: num({ default: 512 * 1024 * 1024 }), // 512MB
  HEALTH_DB_TIMEOUT: num({ default: 500 }), // ms
});

const _AppConfig = () => ({ ...env } as const);

const CONFIG = _AppConfig();
export const AppConfig = () => CONFIG;
