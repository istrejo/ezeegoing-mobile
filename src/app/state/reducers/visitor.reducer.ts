import { createReducer, on } from '@ngrx/store';
import { VisitorState } from './../../core/models/visitor.state';
import * as VisitorActions from '../actions/visitor.actions';

export const initialState: VisitorState = {
  visitors: [],
  loading: false,
  error: null,
};

export const visitorReducer = createReducer(
  initialState,
  on(VisitorActions.loadVisitors, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(VisitorActions.loadVisitorsSuccess, (state, { visitors }) => ({
    ...state,
    visitors,
    loading: false,
    error: null,
  })),
  on(VisitorActions.loadVisitorsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
