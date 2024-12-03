import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReservationTypeState } from './../../core/models/reservation-type-state';

export const selectReservationTypeState =
  createFeatureSelector<ReservationTypeState>('reservationTypes');

export const selectReservationTypes = createSelector(
  selectReservationTypeState,
  (state: ReservationTypeState) => state.reservationTypes
);

export const selectReservationTypeById = (reservationTypeId: number) =>
  createSelector(selectReservationTypeState, (state: ReservationTypeState) =>
    state.reservationTypes.find((rt) => rt.id === reservationTypeId)
  );

export const selectReservationTypeLoading = createSelector(
  selectReservationTypeState,
  (state: ReservationTypeState) => state.loading
);

export const selectReservationTypeError = createSelector(
  selectReservationTypeState,
  (state: ReservationTypeState) => state.error
);
