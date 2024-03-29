import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import { ENV } from '../constants/common.constant';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid(ENV.DEVELOPMENT, ENV.PRODUCTION),
    POSTGRES_HOST: Joi.string(),
    POSTGRES_PORT: Joi.number(),
    POSTGRES_USER: Joi.string(),
    POSTGRES_PASSWORD: Joi.string(),
    POSTGRES_DB: Joi.string(),
    JWT_SECRET: Joi.string(),
    JWT_EXPIRATION: Joi.number(),
    EMAIL_SENDER_USER: Joi.string(),
    EMAIL_SENDER_PASS: Joi.string(),
  }),
};
