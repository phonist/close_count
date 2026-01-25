import bcrypt from 'bcryptjs';
import User from '../../models/user.model';
import { signAuthToken } from '../../utils/auth';

const findUserById = (id: string) => User.findById(id).select('-password');
const findUserByEmail = (email: string) => User.findOne({ email });
const comparePassword = (password: string, hashedPassword: string) =>
  bcrypt.compare(password, hashedPassword);

export { findUserById, findUserByEmail, comparePassword, signAuthToken };
