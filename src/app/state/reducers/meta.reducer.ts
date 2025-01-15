import { AppState } from '../app.state';
import { ActionReducerMap, MetaReducer, Action } from '@ngrx/store';
import { authReducer } from './auth.reducer';
import * as AuthActions from '../actions/auth.actions';
import { buildingReducer } from './building.reducer';
import { reservationReducer } from './reservation.reducer';
import { visitorReducer } from './visitor.reducer';
import { reservationTypeReducer } from './reservation-type.reducer';
import { userReducer } from './user.reducer';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  user: userReducer,
  buildings: buildingReducer,
  reservations: reservationReducer,
  visitors: visitorReducer,
  reservationTypes: reservationTypeReducer,
  // other reducers...
};

export function clearState(reducer: any) {
  return function (state: any, action: Action) {
    if (action.type === AuthActions.clearStore.type) {
      state = undefined;
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = [clearState];
