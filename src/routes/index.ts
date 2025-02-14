import { Router } from 'express';

import authRouter from './auth.routes';
import userRouter from './user.routes';

const router = Router();

// API durumunu kontrol etmek için health check endpoint'i
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API çalışıyor',
    timestamp: new Date().toISOString(),
  });
});

// API rotaları
router.use('/auth', authRouter);
router.use('/users', userRouter);

export default router; 