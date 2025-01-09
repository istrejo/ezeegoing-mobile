import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { VisitorService } from './../../core/services/visitor/visitor.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import {
  addVisitor,
  addVisitorFailure,
  addVisitorSuccess,
  deleteVisitor,
  deleteVisitorFailure,
  deleteVisitorSuccess,
  loadVisitors,
  loadVisitorsFailure,
  loadVisitorsSuccess,
} from '../actions/visitor.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class VisitorEffects {
  private loading = inject(LoadingService);
  private toastService = inject(ToastService);
  private modalService = inject(ModalService);
  private store = inject(Store);

  loadVisitors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadVisitors),
      mergeMap(() =>
        this.visitorService.getVisitors().pipe(
          map((visitors) => {
            console.log('Visitors: ', visitors);
            return loadVisitorsSuccess({ visitors });
          }),
          catchError((error) => of(loadVisitorsFailure({ error })))
        )
      )
    )
  );

  createVisitor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addVisitor),
      mergeMap((action) => {
        this.loading.present('Creando visitante');
        return this.visitorService.createVisitor(action.dto).pipe(
          map((visitor) => {
            this.loading.dismiss();
            this.toastService.success('Visitante creado');
            this.modalService.dismissModal();
            this.store.dispatch(loadVisitors());
            return addVisitorSuccess({ visitor });
          }),
          catchError((error: HttpErrorResponse) => {
            this.toastService.error(error.error.message);
            this.loading.dismiss();
            return of(addVisitorFailure({ error }));
          })
        );
      })
    )
  );

  deleteVisitor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteVisitor),
      mergeMap((action) => {
        this.loading.present('Eliminando visitante');
        return this.visitorService.deleteVisitor(action.visitorId).pipe(
          map(() => {
            this.loading.dismiss();
            this.toastService.success('Visitante eliminado');
            return deleteVisitorSuccess({
              visitorId: action.visitorId,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            this.toastService.error(error.error.message);
            this.loading.dismiss();
            return of(deleteVisitorFailure({ error }));
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
