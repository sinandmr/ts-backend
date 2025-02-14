declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
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