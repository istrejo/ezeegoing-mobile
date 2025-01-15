import { createReducer, on } from '@ngrx/store';
import * as BuildingActions from '../actions/building.actions';
import { BuildingState } from 'src/app/core/models/building.state';

export const initialState: BuildingState = {
  buildings: [],
  loading: false,
  buildingIdSelected: JSON.parse(localStorage.getItem('buildingId') || 'null'),
  currentBuilding: JSON.parse(
    localStorage.getItem('currentBuilding') || 'null'
  ),
  error: null,
};

/* This code snippet is defining a `buildingReducer` using the `createReducer` function provided by
`@ngrx/store`. The `createReducer` function takes in an initial state and a series of reducer
functions defined using the `on` function. */
export const buildingReducer = createReducer(
  initialState,
  on(BuildingActions.loadBuildings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BuildingActions.loadBuildingsSuccess, (state, { buildings }) => ({
    ...state,
    buildings,
    loading: false,
  })),
  on(BuildingActions.loadBuildingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(BuildingActions.selectBuilding, (state, { buildingId }) => ({
    ...state,
    buildingIdSelected: buildingId,
    currentBuilding: state.buildings.find((b) => b.id === buildingId),
    // response.find((u) => u.user.id === user.userId)
  })),
  on(BuildingActions.changeBuilding, (state, { building }) => ({
    ...state,
    currentBuilding: building,
  }))
);
