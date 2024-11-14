import { ActionReducerMap } from '@ngrx/store';
import { ReservationState } from '../core/models/reservations.state';
import { reservationReducer } from './reducers/reservation.reducer';

export interface AppState {
  reservations: ReservationState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  reservations: reservationReducer,
};
