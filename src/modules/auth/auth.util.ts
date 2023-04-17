import * as bcrypt from 'bcrypt';
import { HASH_PASSWORD_SALT } from './auth.constant';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, HASH_PASSWORD_SALT);
};

export const matchPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const secondToMillisecond = (number: number) => {
  return number * 1000;
};
