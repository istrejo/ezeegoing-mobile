import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectReservationsState = (state: AppState) => state.reservations;

export const selectLoading = createSelector(
  selectReservationsState,
  (state) => state.loading
);

export const selectReservations = createSelector(
  selectReservationsState,
  (state) => state.reservations
);
