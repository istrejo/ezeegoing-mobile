import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as BuildingActions from '../actions/building.actions';
import { BuildingService } from 'src/app/core/services/building/building.service';

@Injectable()
export class BuildingEffects {
  private buildingSvc: BuildingService = inject(BuildingService);
  private actions$ = inject(Actions);

  loadBuildings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BuildingActions.loadBuildings),
      mergeMap(() =>
        this.buildingSvc.getBuildings().pipe(
          map((buildings) =>
            BuildingActions.loadBuildingsSuccess({ buildings })
          ),
          catchError((error) =>
            of(BuildingActions.loadBuildingsFailure({ error }))
          )
        )
      )
    )
  );
}
