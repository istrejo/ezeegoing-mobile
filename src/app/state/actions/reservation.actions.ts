import { createAction, props } from '@ngrx/store';
import { Reservation } from '../../core/models/reservation.interface';

type reservationType = 'charger' | 'parking' | 'common' | 'visitor';

// Action to load reservations
export const loadReservations = createAction('[Reservation] Load Reservations');

// Action triggered when reservations are successfully loaded
export const loadReservationsSuccess = createAction(
  '[Reservation] Load Reservations Success',
  props<{ reservations: Reservation[] }>()
);

// Action triggered when loading reservations fails
export const loadReservationsFailure = createAction(
  '[Reservation] Load Reservations Failure',
  props<{ error: any }>()
);

// Action to add a new reservation
export const addReservation = createAction(
  '[Reservation] Add Reservation',
  props<{ dtoList?: any[]; dto?: any; reservationType?: number }>()
);

// Action triggered when a reservation is successfully added
export const addReservationSuccess = createAction(
  '[Reservation] Add Reservation Success',
  props<{ reservation: Reservation }>()
);

// Action triggered when adding a reservation fails
export const addReservationFailure = createAction(
  '[Reservation] Add Reservation Failure',
  props<{ error: any }>()
);

// Action to update an existing reservation
export const updateReservation = createAction(
  '[Reservation] Update Reservation',
  props<{ reservationId: number; dto: any }>()
);

// Action triggered when a reservation is successfully updated
export const updateReservationSuccess = createAction(
  '[Reservation] Update Reservation Success',
  props<{ reservation: Reservation }>()
);

// Action triggered when updating a reservation fails
export const updateReservationFailure = createAction(
  '[Reservation] Update Reservation Failure',
  props<{ error: any }>()
);

// Action to delete a reservation
export const deleteReservation = createAction(
  '[Reservation] Delete Reservation',
  props<{ reservationId: number }>()
);

// Action triggered when a reservation is successfully deleted
export const deleteReservationSuccess = createAction(
  '[Reservation] Delete Reservation Success',
  props<{ reservationId: number }>()
);

// Action triggered when deleting a reservation fails
export const deleteReservationFailure = createAction(
  '[Reservation] Delete Reservation Failure',
  props<{ error: any }>()
);
