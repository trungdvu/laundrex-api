import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ENV } from '../src/constants/common.constant';

dotenv.config();

const getSslOptions = (nodeEnv: string) => {
  if (nodeEnv === ENV.DEVELOPMENT) {
    return false;
  }
  return {
    requestCert: true,
    rejectUnauthorized: false,
  };
};

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  ssl: getSslOptions(process.env.NODE_ENV),
};

export default new DataSource(dataSourceOptions);
