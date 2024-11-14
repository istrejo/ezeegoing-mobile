import { createReducer, on } from '@ngrx/store';
import {
  addReservationSuccess,
  deleteReservation,
  loadReservations,
  loadReservationsFailure,
  loadReservationsSuccess,
} from '../actions/reservation.actions';
import { ReservationState } from 'src/app/core/models/reservations.state';

export const initialState: ReservationState = {
  reservations: [],
  loading: false,
  error: null,
};

export const reservationReducer = createReducer(
  initialState,
  on(loadReservations, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadReservationsSuccess, (state, { reservations }) => ({
    ...state,
    reservations: [...reservations],
    loading: false,
  })),
  on(loadReservationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addReservationSuccess, (state, { reservation }) => ({
    ...state,
    reservations: [...state.reservations, reservation],
  })),
  on(deleteReservation, (state, { reservationId }) => ({
    ...state,
    reservations: state.reservations.filter(
      (reservation) => reservation.id !== reservationId
    ),
  }))
);
