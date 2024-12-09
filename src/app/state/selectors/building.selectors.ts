import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { BuildingState } from 'src/app/core/models/building.state';

// export const selectBuildingState = (state: AppState) => state.buildings;
export const selectBuildingState =
  createFeatureSelector<BuildingState>('buildings');

export const selectBuildings = createSelector(
  selectBuildingState,
  (state) => state.buildings
);

export const selectBuildingLoading = createSelector(
  selectBuildingState,
  (state) => state.loading
);

export const selectBuildingError = createSelector(
  selectBuildingState,
  (state) => state.error
);

export const selectBuildingSelected = createSelector(
  selectBuildingState,
  (state) => state.buildingIdSelected
);
