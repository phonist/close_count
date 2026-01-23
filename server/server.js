require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const app = express();

const PORT = process.env.PORT || 8001;

// Connect Database
connectDB(process.env.MONGO_URI);

// set security HTTP headers
app.use(helmet());

//parse json request body
app.use(express.json({ limit: '10mb' }));

//parse urlencoded data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//sanitize request data
app.use(xss());
app.use(mongoSanitize());

//gzip compression
app.use(compression());

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
const corsOptions = {
  origin: process.env.CLIENT_URL || process.env.CLIENT || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/timers', require('./routes/api/timers'));

// Error handling middleware (must be after routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static assets in production
if (process.env.ENVIRONMENT === 'production') {
  const root = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(root));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(root, 'index.html'));
  });
}
 
const logger = require('./utils/logger');

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  logger.info(`Environment: ${process.env.ENVIRONMENT || 'development'}`);
});
 
