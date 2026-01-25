import jwt from 'jsonwebtoken';
import env from '../config/env';
import type { AuthTokenPayload } from '../features/auth/auth.interfaces';

const signAuthToken = (payload: AuthTokenPayload) =>
  new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      env.jwtSecret,
      { expiresIn: env.jwtExpire },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token as string);
      }
    );
  });

export { signAuthToken };
