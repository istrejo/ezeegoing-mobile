import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { VisitorService } from './../../core/services/visitor/visitor.service';
import * as VisitorActions from '../actions/visitor.actions';

@Injectable()
export class VisitorEffects {
  loadVisitors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VisitorActions.loadVisitors),
      mergeMap(() =>
        this.visitorService.getVisitors().pipe(
          map((visitors) => {
            console.log('Visitors: ', visitors);
            return VisitorActions.loadVisitorsSuccess({ visitors });
          }),
          catchError((error) =>
            of(VisitorActions.loadVisitorsFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private visitorService: VisitorService
  ) {}
}
