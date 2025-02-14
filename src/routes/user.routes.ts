import { Router } from 'express';

import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Kullanıcı rotaları
router.get('/', authenticate, authorize('admin'), (req, res) => {
  // Tüm kullanıcıları listele (sadece admin)
});

router.get('/:id', authenticate, (req, res) => {
  // Belirli bir kullanıcının bilgilerini getir
});

router.put('/:id', authenticate, (req, res) => {
  // Kullanıcı bilgilerini güncelle
});

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  // Kullanıcıyı sil (sadece admin)
});

export default router; 