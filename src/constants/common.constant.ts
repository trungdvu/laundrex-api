export const Role = {
  Administrator: 'Administrator',
  User: 'Aser',
} as const;
export type RoleValue = (typeof Role)[keyof typeof Role];

export const ServiceUnit = {
  Kilogram: 'kilogram',
  Item: 'item',
} as const;
export type ServiceUnitValue = (typeof ServiceUnit)[keyof typeof ServiceUnit];

export const BookingStatus = {
  Confirmed: 'confirmed',
  InProgress: 'in_progress',
  Delivering: 'delivering',
  Done: 'done',
} as const;
export type BookingStatusValue =
  (typeof BookingStatus)[keyof typeof BookingStatus];
