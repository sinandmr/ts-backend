import cors from 'express';
import helmet from 'helmet';

import config from './config';
import { errorHandler } from './middlewares/errorHandler';
import { checkMaintenance } from './middlewares/maintenance';
import { rateLimiter } from './middlewares/rateLimiter';
import routes from './routes';
import { MongoDBService } from './services/mongodb.service';
import { RedisService } from './services/redis.service';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));
app.use(rateLimiter);

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database services and assign to global variables
global.mongoDBService = MongoDBService.getInstance();
global.redisService = RedisService.getInstance();

// Maintenance mode check
app.use('/api', checkMaintenance);

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handling
app.use(errorHandler);

export default app; 