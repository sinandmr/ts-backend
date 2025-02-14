import { Router } from 'express';

import { authenticate } from '../middlewares/auth';

const router = Router();

// Auth rotaları
router.post('/register', (req, res) => {
  // Register endpoint'i
});

router.post('/login', (req, res) => {
  // Login endpoint'i
});

router.post('/logout', authenticate, (req, res) => {
  // Logout endpoint'i
});

router.post('/refresh-token', (req, res) => {
  // Token yenileme endpoint'i
});

router.get('/me', authenticate, (req, res) => {
  // Kullanıcı bilgileri endpoint'i
});

export default router; 