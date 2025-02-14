/// <reference path="../../global.d.ts" />
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  PORT: z.string().transform(Number),
  MONGO_URI: z.string(),
  REDIS_URL: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGINS: z.string().transform(str => str.split(',')),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
});

const configValidation = configSchema.safeParse(process.env);

if (!configValidation.success) {
  console.error('❌ Invalid environment variables:', configValidation.error.format());
  process.exit(1);
}

const config: Config = {
  port: configValidation.data.PORT,
  mongoUri: configValidation.data.MONGO_URI,
  redisUrl: configValidation.data.REDIS_URL,
  jwtSecret: configValidation.data.JWT_SECRET,
  environment: configValidation.data.NODE_ENV,
  corsOrigins: configValidation.data.CORS_ORIGINS,
  rateLimiting: {
    windowMs: configValidation.data.RATE_LIMIT_WINDOW_MS,
    max: configValidation.data.RATE_LIMIT_MAX,
  },
};

export default config; 