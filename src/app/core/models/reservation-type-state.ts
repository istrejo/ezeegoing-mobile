import { ReservationType } from './reservation.interface';

export interface ReservationTypeState {
  reservationTypes: ReservationType[];
  loading: boolean;
  error?: any;
}
