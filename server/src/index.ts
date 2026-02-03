import dotenv from 'dotenv';
dotenv.config();

import express, { type RequestHandler } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db';
import env from './config/env';
import swaggerSpec from './config/swagger';
import logger from './utils/logger';
import errorHandler from './middlewares/errorHandler';
import { authRoutes, userRoutes, timerRoutes } from './features';

const app = express();
const PORT = env.port;

// Connect Database
connectDB(env.mongoUri);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: '10mb' }));

// parse urlencoded data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression() as unknown as RequestHandler);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

app.use('/api/', limiter);
app.use('/api/auth', authLimiter);
app.use('/api/users', authLimiter);

// enable cors with specific origins
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Swagger docs
app.use(
  '/api/docs',
  ...(swaggerUi.serve as unknown as express.RequestHandler[]),
  swaggerUi.setup(swaggerSpec) as unknown as express.RequestHandler
);
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/timers', timerRoutes);

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Serve static assets in production
if (env.environment === 'production') {
  const root = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(root));

  app.get('/*', (_req, res) => {
    res.sendFile(path.join(root, 'index.html'));
  });
}

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  logger.info(`Environment: ${env.environment}`);
});
