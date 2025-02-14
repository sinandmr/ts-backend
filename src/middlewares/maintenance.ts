import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ERROR_CODES } from '../constants/errorCodes';

export const checkMaintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Redis'ten bakım modu durumunu kontrol et
    const maintenance = await global.redisService.get('settings:maintenance');

    if (maintenance === 'true') {
      res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        error: {
          code: ERROR_CODES.MAINTENANCE,
          message: 'Sistem bakımda. Lütfen daha sonra tekrar deneyin.',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    next();
  } catch (error) {
    // Bakım modu kontrolünde hata olursa, güvenli tarafta kal ve erişimi engelle
    console.error('Bakım modu kontrolünde hata:', error);
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      success: false,
      error: {
        code: ERROR_CODES.MAINTENANCE,
        message: 'Sistem durumu kontrol edilemiyor. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date().toISOString()
      }
    });
  }
}; 