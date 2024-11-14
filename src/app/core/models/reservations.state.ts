import { Reservation } from './reservation.interface';

export interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  error?: any;
}
