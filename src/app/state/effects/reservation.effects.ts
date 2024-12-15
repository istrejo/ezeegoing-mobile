import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ReservationService } from '../../core/services/reservation/reservation.service';
import {
  loadReservations,
  loadReservationsSuccess,
  loadReservationsFailure,
  addReservation,
  addReservationSuccess,
  addReservationFailure,
  deleteReservation,
  deleteReservationSuccess,
  deleteReservationFailure,
} from '../actions/reservation.actions';

@Injectable()
export class ReservationEffects {
  constructor(
    private actions$: Actions,
    private reservationService: ReservationService
  ) {}

  loadReservations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadReservations),
      mergeMap(() =>
        this.reservationService.getAll().pipe(
          map((reservations) => {
            return loadReservationsSuccess({ reservations });
          }),
          catchError((error) => {
            return of(loadReservationsFailure({ error }));
          })
        )
      )
    );
  });

  addReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addReservation),
      mergeMap((action) =>
        this.reservationService.createReservation(action.reservation).pipe(
          map((reservation) => addReservationSuccess({ reservation })),
          catchError((error) => of(addReservationFailure({ error })))
        )
      )
    )
  );

  deleteReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteReservation),
      mergeMap((action) =>
        this.reservationService.delete(action.reservationId).pipe(
          map(() =>
            deleteReservationSuccess({
              reservationId: action.reservationId,
            })
          ),
          catchError((error) => of(deleteReservationFailure({ error })))
        )
      )
    )
  );
}
