import { BookingDetailEntity } from './entities/booking-detail.entity';

export const calculateBookingTotal = (
  bookingDetails: BookingDetailEntity[],
) => {
  return bookingDetails.reduce((acc, item) => {
    acc += item.price * item.quantity;
    return acc;
  }, 0);
};
