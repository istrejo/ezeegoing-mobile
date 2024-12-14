import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  clearStore,
} from '../actions/auth.actions';
import { AuthState } from 'src/app/core/models/auth.state.interface';

const userData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData') || '{}')
  : null;

export const initialState: AuthState = {
  isAuthenticated: !!userData,
  userData: userData,
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
    userData: null,
    error: null,
  })),
  on(clearStore, (state) => ({
    isAuthenticated: false,
    userData: null,
    error: null,
  }))
);
