# Modern Express TypeScript Boilerplate

🚀 Modern, secure, and scalable TypeScript-based backend boilerplate.

## Features

- ⚡️ TypeScript & Express.js based
- 🔒 Advanced session management with JWT and Redis
- 🛡️ Security measures (Helmet, CORS, Rate Limiting)
- 📦 MongoDB and Redis integration
- 🔍 Strong type checking and validation with Zod
- 🛠️ Modular architecture (Controllers, Services, Routes)
- 🔄 Maintenance mode support
- 📝 Logging with Winston
- ✨ ESLint and Prettier integration
- 🧪 Testing infrastructure with Jest

## Security Features

- ✅ Client IP and User-Agent validation
- ✅ Test client control
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Global error handling

## Database & Cache

- 📊 Data storage with MongoDB
- ⚡️ Caching and session management with Redis
- 🔄 Database connection management with Singleton pattern

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/modern-express-ts-boilerplate.git
cd modern-express-ts-boilerplate
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/modern-backend
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

4. Start development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Project Structure

```
src/
├── config/         # Configuration files
├── constants/      # Constants and enums
├── middlewares/    # Express middlewares
├── models/         # MongoDB models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## API Endpoints

### Auth Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user info

### User Routes

- `GET /api/users` - List all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Express.js
- TypeScript
- MongoDB
- Redis
- JWT
- And all other open source libraries used in this project

A modern and secure Express.js backend template ready for production, featuring a scalable and maintainable architecture.

## Docker Support

### Development

```bash
# Start the development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the environment
docker-compose down
```

### Production

```bash
# Build production image
docker build -t modern-express-ts .

# Run production container
docker run -d -p 3000:3000 --name api modern-express-ts
```

### Docker Features

- Multi-stage builds for optimal image size
- Development and production Dockerfiles
- Docker Compose for local development
- Health checks for all services
- Volume mapping for hot reload
- Non-root user for security
- Container orchestration ready

## CI/CD with Jenkins

The project includes a complete Jenkins pipeline configuration with the following stages:

1. **Checkout**: Clone the repository
2. **Install**: Install dependencies
3. **Lint**: Run code quality checks
4. **Test**: Execute test suite
5. **Build**: Compile TypeScript code
6. **Docker Build**: Create Docker image
7. **Docker Push**: Push to registry (main branch only)
8. **Deploy**: Automatic deployment to development/production

### Jenkins Setup

1. Create a new Pipeline job in Jenkins
2. Configure GitHub/GitLab webhook
3. Add Docker Hub credentials in Jenkins
4. Set up environment variables if needed
5. The pipeline will automatically run on push
