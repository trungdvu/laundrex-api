import * as bcrypt from 'bcrypt';

const SALT = 10;

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, SALT);
};

export const matchPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
