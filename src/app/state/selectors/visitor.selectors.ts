import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VisitorState } from './../../core/models/visitor.state';

export const selectVisitorState =
  createFeatureSelector<VisitorState>('visitors');

export const selectVisitors = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.visitors
);

export const selectVisitorById = (visitorId: number) =>
  createSelector(selectVisitorState, (state: VisitorState) =>
    state.visitors.find((visitor) => visitor.id === visitorId)
  );

export const selectVisitorLoading = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.loading
);

export const selectVisitorError = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.error
);
export const selectVisitorsLoading = createSelector(
  selectVisitorState,
  (state: VisitorState) => state.loading
);
