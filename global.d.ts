import { MongoDBService } from './src/services/mongodb.service';
import { RedisService } from './src/services/redis.service';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URI: string;
      REDIS_URL: string;
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production' | 'test';
      CORS_ORIGINS: string;
      RATE_LIMIT_WINDOW_MS: string;
      RATE_LIMIT_MAX: string;
    }

    interface Global {
      mongoDBService: MongoDBService;
      redisService: RedisService;
    }
  }

  interface PaginationOptions {
    page: number;
    limit: number;
    sort?: Record<string, 1 | -1>;
  }

  interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    meta?: {
      total?: number;
      page?: number;
      totalPages?: number;
    };
  }

  interface JWTPayload {
    id: string;
    email: string;
    role: string;
  }

  interface Config {
    port: number;
    mongoUri: string;
    redisUrl: string;
    jwtSecret: string;
    environment: 'development' | 'production' | 'test';
    corsOrigins: string[];
    rateLimiting: {
      windowMs: number;
      max: number;
    };
  }
} 