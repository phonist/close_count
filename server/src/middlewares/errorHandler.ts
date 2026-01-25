import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import env from '../config/env';

interface ErrorPayload {
  message?: string;
  statusCode?: number;
  code?: number;
  name?: string;
  errors?: Record<string, { message: string }>;
  stack?: string;
}

const errorHandler = (err: ErrorPayload, _req: Request, res: Response, _next: NextFunction) => {
  let error: ErrorPayload = { ...err };
  error.message = err.message;

  logger.error('Error:', err.message || err);

  if (err.name === 'CastError') {
    error = { message: 'Resource not found', statusCode: 404 };
  }

  if (err.code === 11000) {
    error = { message: 'Duplicate field value entered', statusCode: 400 };
  }

  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = { message, statusCode: 400 };
  }

  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Invalid token', statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expired', statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(env.environment === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
