import rateLimit from 'express-rate-limit';

import config from '../config';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.max,
  message: {
    success: false,
    error: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 