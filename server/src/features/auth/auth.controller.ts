import { Request, Response, NextFunction } from 'express';
import {
  findUserById,
  findUserByEmail,
  comparePassword,
  signAuthToken,
} from './auth.service';
import type { AuthTokenResponse, AuthUserResponse, LoginRequest } from './auth.dtos';

const getAuthUser = async (
  req: Request,
  res: Response<AuthUserResponse | { msg: string }>,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      date: user.date.toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

const login = async (
  req: Request,
  res: Response<AuthTokenResponse | { errors: Array<{ msg: string }> }>,
  next: NextFunction
) => {
  const { email, password } = req.body as LoginRequest;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = await signAuthToken(payload);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export { getAuthUser, login };
