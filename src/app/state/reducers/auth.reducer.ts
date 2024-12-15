import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  clearStore,
  updateAccessToken,
  updateRefreshToken,
} from '../actions/auth.actions';
import { AuthState } from 'src/app/core/models/auth.state.interface';

const userData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData') || '{}')
  : null;

export const initialState: AuthState = {
  access_token: userData?.access_token || '',
  refresh_token: userData?.refresh_token || '',
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
    access_token: userData.access_token,
    refresh_token: userData.refresh_token,
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
    access_token: null,
    refresh_token: null,
    isAuthenticated: false,
    userData: null,
    error: null,
  })),
  on(updateAccessToken, (state: AuthState, { access_token }) => ({
    ...state,
    access_token,
  })),
  on(updateRefreshToken, (state: AuthState, { refresh_token }) => ({
    ...state,
    refresh_token,
  }))
);
