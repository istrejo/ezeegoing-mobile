import { createReducer, on, Action } from '@ngrx/store';
import * as ReservationTypeActions from '../actions/reservation-type.actions';
import { ReservationTypeState } from 'src/app/core/models/reservation-type-state';

export const initialState: ReservationTypeState = {
  reservationTypes: [],
  loading: false,
  error: null,
};

export const reservationTypeReducer = createReducer(
  initialState,
  on(ReservationTypeActions.loadReservationTypes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    ReservationTypeActions.loadReservationTypesSuccess,
    (state, { reservationTypes }) => ({
      ...state,
      reservationTypes,
      loading: false,
      error: null,
    })
  ),
  on(
    ReservationTypeActions.loadReservationTypesFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  )
);
