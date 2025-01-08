import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { VisitorService } from './../../core/services/visitor/visitor.service';
import * as VisitorActions from '../actions/visitor.actions';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class VisitorEffects {
  private loading = inject(LoadingService);
  private toastService = inject(ToastService);

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

  deleteVisitor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VisitorActions.deleteVisitor),
      mergeMap((action) => {
        this.loading.present('Eliminando visitante');
        return this.visitorService.deleteVisitor(action.visitorId).pipe(
          map(() => {
            this.loading.dismiss();
            this.toastService.success('Visitante eliminado');
            return VisitorActions.deleteVisitorSuccess({
              visitorId: action.visitorId,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            this.toastService.error(error.error.message);
            this.loading.dismiss();
            return of(VisitorActions.deleteVisitorFailure({ error }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private visitorService: VisitorService
  ) {}
}
