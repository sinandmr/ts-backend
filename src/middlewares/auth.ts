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
    // Token kontrolü
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Yetkilendirme başlığı geçersiz', ERROR_CODES.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError(401, 'Token bulunamadı', ERROR_CODES.UNAUTHORIZED);
    }

    // JWT doğrulama
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;

    // Redis'ten session kontrolü
    const sessionKey = `session:${decoded.id}`;
    const sessionData = await global.redisService.get(sessionKey);

    if (!sessionData) {
      throw new AppError(401, 'Oturum süresi dolmuş veya geçersiz', ERROR_CODES.SESSION_EXPIRED);
    }

    const session = JSON.parse(sessionData);

    // Client bilgilerini kontrol et
    if (session.clientInfo && process.env.NODE_ENV === 'production') {
      const currentUserAgent = req.headers['user-agent'] ?? '';
      const currentClientIp =
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        '';

      const isTestClient =
        currentUserAgent.toLowerCase().includes('postman') ||
        !currentUserAgent;

      // Test client kontrolü
      if (isTestClient) {
        throw new AppError(
          403,
          'Test istemcilerine izin verilmiyor',
          ERROR_CODES.TEST_CLIENT_NOT_ALLOWED
        );
      }

      // User-Agent ve IP kontrolü
      if (
        session.clientInfo.userAgent !== currentUserAgent ||
        session.clientInfo.ip !== currentClientIp
      ) {
        throw new AppError(
          401,
          'Oturum bilgileri eşleşmiyor',
          ERROR_CODES.CLIENT_INFO_MISMATCH
        );
      }
    }

    // Session'ı yenile
    await global.redisService.set(
      sessionKey,
      JSON.stringify(session),
      60 * 60 // 1 saat
    );

    req.user = {
      ...decoded,
      ...session.user
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Geçersiz veya süresi dolmuş token', ERROR_CODES.UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Yetkilendirme gerekli', ERROR_CODES.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, 'Bu işlemi gerçekleştirmek için yetkiniz yok', ERROR_CODES.FORBIDDEN)
      );
    }

    next();
  };
}; 