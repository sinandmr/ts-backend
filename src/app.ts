import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import config from './config';
import { errorHandler } from './middlewares/errorHandler';
import { checkMaintenance } from './middlewares/maintenance';
import { rateLimiter } from './middlewares/rateLimiter';
import routes from './routes';
import { MongoDBService } from './services/mongodb.service';
import { RedisService } from './services/redis.service';

const app = express();

// Güvenlik middleware'leri
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));
app.use(rateLimiter);

// Body parsing middleware'leri
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Veritabanı servislerini başlat ve global değişkenlere ata
global.mongoDBService = MongoDBService.getInstance();
global.redisService = RedisService.getInstance();

// Bakım modu kontrolü
app.use('/api', checkMaintenance);

// API rotaları
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'İstenen endpoint bulunamadı',
  });
});

// Hata yönetimi
app.use(errorHandler);

export default app; 