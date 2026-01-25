import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import normalize from 'normalize-url';
import User from '../../models/user.model';
import type { CreateUserInput } from './users.interfaces';
import { signAuthToken } from '../../utils/auth';

const findUserByEmail = (email: string) => User.findOne({ email });

const buildAvatar = (email: string) =>
  normalize(
    gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    }),
    { forceHttps: true }
  );

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const createUser = ({ name, email, avatar, password }: CreateUserInput) =>
  new User({ name, email, avatar, password });

export { findUserByEmail, buildAvatar, hashPassword, createUser, signAuthToken };
