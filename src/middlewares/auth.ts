import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import { ERROR_CODES } from '../constants/errorCodes';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Token check
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Invalid authorization header', ERROR_CODES.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError(401, 'Token not found', ERROR_CODES.UNAUTHORIZED);
    }

    // JWT verification
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;

    // Session check from Redis
    const sessionKey = `session:${decoded.id}`;
    const sessionData = await global.redisService.get(sessionKey);

    if (!sessionData) {
      throw new AppError(401, 'Session expired or invalid', ERROR_CODES.SESSION_EXPIRED);
    }

    const session = JSON.parse(sessionData);

    // Check client information
    if (session.clientInfo && process.env.NODE_ENV === 'production') {
      const currentUserAgent = req.headers['user-agent'] ?? '';
      const currentClientIp =
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        '';

      const isTestClient =
        currentUserAgent.toLowerCase().includes('postman') ||
        !currentUserAgent;

      // Test client check
      if (isTestClient) {
        throw new AppError(
          403,
          'Test clients are not allowed',
          ERROR_CODES.TEST_CLIENT_NOT_ALLOWED
        );
      }

      // User-Agent and IP check
      if (
        session.clientInfo.userAgent !== currentUserAgent ||
        session.clientInfo.ip !== currentClientIp
      ) {
        throw new AppError(
          401,
          'Session information mismatch',
          ERROR_CODES.CLIENT_INFO_MISMATCH
        );
      }
    }

    // Refresh session
    await global.redisService.set(
      sessionKey,
      JSON.stringify(session),
      60 * 60 // 1 hour
    );

    req.user = {
      ...decoded,
      ...session.user
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid or expired token', ERROR_CODES.UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authorization required', ERROR_CODES.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, 'You do not have permission to perform this action', ERROR_CODES.FORBIDDEN)
      );
    }

    next();
  };
}; 