import { createAction, props } from '@ngrx/store';
import { Building } from 'src/app/core/models/building.state';

export const loadBuildings = createAction('[Building] Load Buildings');

export const loadBuildingsSuccess = createAction(
  '[Building] Load Buildings Success',
  props<{ buildings: Building[] }>()
);

export const loadBuildingsFailure = createAction(
  '[Building] Load Buildings Failure',
  props<{ error: any }>()
);

export const selectBuilding = createAction(
  '[Building] Select Building',
  props<{ buildingId: number | null }>()
);

export const changeBuilding = createAction(
  '[Building] Change Building',
  props<{ building: Building | null }>()
);
