import { Request, Response, NextFunction } from 'express';
import {
  findUserByEmail,
  buildAvatar,
  hashPassword,
  createUser,
  signAuthToken,
} from './users.service';
import type { AuthTokenResponse, RegisterRequest } from './users.dtos';

const registerUser = async (
  req: Request,
  res: Response<AuthTokenResponse | { errors: Array<{ msg: string }> }>,
  next: NextFunction
) => {
  const { name, email, password } = req.body as RegisterRequest;

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User already exists' }] });
    }

    const avatar = buildAvatar(email);
    const hashedPassword = await hashPassword(password);

    const user = createUser({
      name,
      email,
      avatar,
      password: hashedPassword,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = await signAuthToken(payload);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export { registerUser };
