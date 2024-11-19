import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
} from '../actions/auth.actions';
import { AuthState } from 'src/app/core/models/auth.state.interface';

export const initialState: AuthState = {
  isAuthenticated: false,
  userData: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({
    ...state,
    error: null,
  })),
  on(loginSuccess, (state, { userData }) => ({
    ...state,
    isAuthenticated: true,
    userData,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(logout, (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    error: null,
  }))
);
