import { BOOKING_STATUS, SERVICE_UNIT, TOKEN_ACTION } from './common.constant';

export type ServiceUnitValue = (typeof SERVICE_UNIT)[keyof typeof SERVICE_UNIT];

export type BookingStatusValue =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export type TokenActionValue = (typeof TOKEN_ACTION)[keyof typeof TOKEN_ACTION];
