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
import { LoadingController, ModalController } from '@ionic/angular';
import { SuccessModalComponent } from 'src/app/pages/create-reservation/components/success-modal/success-modal.component';

@Injectable()
export class ReservationEffects {
  private loadingCtrl = inject(LoadingController);
  private modalCtrl = inject(ModalController);
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
            const reversedReservations = reservations.reverse();
            return loadReservationsSuccess({
              reservations: reversedReservations,
            });
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
      mergeMap((action) => {
        this.presentLoading('Creando reservación');
        return this.reservationService.createReservation(action.dto).pipe(
          map((reservation) => {
            this.loadingCtrl.dismiss();
            this.openSuccessModal();
            return addReservationSuccess({ reservation });
          }),
          catchError((error) => {
            this.loadingCtrl.dismiss();
            return of(addReservationFailure({ error }));
          })
        );
      })
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

  /* The `presentLoading()` function is an asynchronous function that creates and presents a loading
spinner using the `LoadingController` provided by Ionic. */
  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
      mode: 'ios',
    });
    await loading.present();
  }

  /**
   * The openBuildingModal function asynchronously creates and presents a modal component for a building.
   */
  async openSuccessModal() {
    const modal = await this.modalCtrl.create({
      component: SuccessModalComponent,
    });
    await modal.present();
  }
}
