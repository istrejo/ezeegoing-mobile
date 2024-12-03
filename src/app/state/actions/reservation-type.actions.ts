import { createAction, props } from '@ngrx/store';
import { ReservationType } from 'src/app/core/models/reservation.interface';

export const loadReservationTypes = createAction(
  '[Reservation Type] Load Reservation Types'
);

export const loadReservationTypesSuccess = createAction(
  '[Reservation Type] Load Reservation Types Success',
  props<{ reservationTypes: ReservationType[] }>()
);

export const loadReservationTypesFailure = createAction(
  '[Reservation Type] Load Reservation Types Failure',
  props<{ error: any }>()
);
