import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { AuthState } from 'src/app/core/models/auth.state.interface';

export const selectAuthState = (state: AppState) => state.auth;

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.isAuthenticated
);

export const selectUser = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.userData?.user
);

export const selectAuthError = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.error
);
