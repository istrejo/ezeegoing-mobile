import { ActionReducerMap } from '@ngrx/store';
import { ReservationState } from '../core/models/reservations.state';
import { reservationReducer } from './reducers/reservation.reducer';
import { AuthState } from '../core/models/auth.state.interface';
import { authReducer } from './reducers/auth.reducer';
import { ReservationTypeState } from '../core/models/reservation-type-state';
import { reservationTypeReducer } from './reducers/reservation-type.reducer';
import { buildingReducer } from './reducers/building.reducer';
import { BuildingState } from '../core/models/building.state';
import { VisitorState } from '../core/models/visitor.state';
import { visitorReducer } from './reducers/visitor.reducer';

export interface AppState {
  auth: AuthState;
  reservations: ReservationState;
  reservationTypes: ReservationTypeState;
  buildings: BuildingState;
  visitors: VisitorState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  auth: authReducer,
  reservations: reservationReducer,
  reservationTypes: reservationTypeReducer,
  buildings: buildingReducer,
  visitors: visitorReducer,
};
