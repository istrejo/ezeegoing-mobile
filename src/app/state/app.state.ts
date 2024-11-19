import { ActionReducerMap } from '@ngrx/store';
import { ReservationState } from '../core/models/reservations.state';
import { reservationReducer } from './reducers/reservation.reducer';
import { AuthState } from '../core/models/auth.state.interface';
import { authReducer } from './reducers/auth.reducer';

export interface AppState {
  auth: AuthState;
  reservations: ReservationState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  auth: authReducer,
  reservations: reservationReducer,
};
