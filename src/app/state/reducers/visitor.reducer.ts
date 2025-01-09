import { createReducer, on } from '@ngrx/store';
import { VisitorState } from './../../core/models/visitor.state';
import {
  deleteVisitor,
  loadVisitors,
  loadVisitorsFailure,
  loadVisitorsSuccess,
  updateVisitor,
} from '../actions/visitor.actions';
// import * as VisitorActions from '../actions/visitor.actions';

export const initialState: VisitorState = {
  visitors: [],
  loading: false,
  error: null,
};

export const visitorReducer = createReducer(
  initialState,
  on(loadVisitors, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadVisitorsSuccess, (state, { visitors }) => ({
    ...state,
    visitors,
    loading: false,
    error: null,
  })),
  on(loadVisitorsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deleteVisitor, (state, { visitorId }) => ({
    ...state,
    visitors: state.visitors.filter((visitor) => visitor.id !== visitorId),
    loading: false,
    error: null,
  })),
  on(updateVisitor, (state, { visitor }) => ({
    ...state,
    visitors: state.visitors.map((v) => (v.id === visitor.id ? visitor : v)),
    loading: false,
    error: null,
  }))
);
