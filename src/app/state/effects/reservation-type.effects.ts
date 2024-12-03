import { ReservationService } from './../../core/services/reservation/reservation.service';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ReservationTypeActions from '../actions/reservation-type.actions';

@Injectable()
export class ReservationTypeEffects {
  private actions$: Actions = inject(Actions);
  private reservationSvc: ReservationService = inject(ReservationService);

  loadReservationTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationTypeActions.loadReservationTypes),
      mergeMap(() =>
        this.reservationSvc.getTypes().pipe(
          map((reservationTypes) =>
            ReservationTypeActions.loadReservationTypesSuccess({
              reservationTypes,
            })
          ),
          catchError((error) =>
            of(ReservationTypeActions.loadReservationTypesFailure({ error }))
          )
        )
      )
    )
  );

  constructor() {}
}
