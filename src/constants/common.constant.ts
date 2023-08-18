export const ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};

export const S3_REGION = 'us-east-1';
export const S3_BUCKET = 'laundrex-assets';

export const META_DATA_KEY = {
  IS_PUBLIC_API: 'isPublicApi',
};

export const ERROR_CODE = {
  EMAIL_EXISTED: 'email-existed',
  TOKEN_EXPIRED: 'token-expired',
  INVALID_PASSWORD: 'invalid-password',
  USER_NOT_FOUND: 'user-not-found',
  CUSTOMER_EXISTED: 'customer-existed',
};

export const ROLE = {
  ADMINISTRATOR: 'administrator',
  USER: 'user',
} as const;
export type RoleValue = (typeof ROLE)[keyof typeof ROLE];

export const SERVICE_UNIT = {
  KILOGRAM: 'kilogram',
  ITEM: 'item',
} as const;

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  DELIVERING: 'delivering',
  DONE: 'done',
} as const;

export const TOKEN_ACTION = {
  VERIFY_EMAIL: 'verify_email',
} as const;
