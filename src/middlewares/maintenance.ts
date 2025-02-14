import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ERROR_CODES } from '../constants/errorCodes';

export const checkMaintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check maintenance mode status from Redis
    const maintenance = await global.redisService.get('settings:maintenance');

    if (maintenance === 'true') {
      res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        error: {
          code: ERROR_CODES.MAINTENANCE,
          message: 'System is under maintenance. Please try again later.',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    next();
  } catch (error) {
    // If maintenance check fails, stay on the safe side and block access
    console.error('Error checking maintenance mode:', error);
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      success: false,
      error: {
        code: ERROR_CODES.MAINTENANCE,
        message: 'Unable to check system status. Please try again later.',
        timestamp: new Date().toISOString()
      }
    });
  }
}; 