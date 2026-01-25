import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import type { AuthTokenPayload } from '../features/auth/auth.interfaces';
import env from '../config/env';

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader;

  try {
    jwt.verify(token, env.jwtSecret, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      }

      const payload = decoded as AuthTokenPayload;
      if (payload?.user) {
        req.user = payload.user;
      }
      next();
    });
  } catch (err) {
    const error = err as Error;
    logger.error('Auth middleware error:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

export default auth;
