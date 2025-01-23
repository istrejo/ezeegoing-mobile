import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
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
  updateReservation,
  updateReservationSuccess,
  updateReservationFailure,
} from '../actions/reservation.actions';
import { LoadingController, ModalController } from '@ionic/angular';
import { SuccessModalComponent } from 'src/app/pages/create-reservation/components/success-modal/success-modal.component';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';

@Injectable()
export class ReservationEffects {
  private loadingCtrl = inject(LoadingController);
  private modalCtrl = inject(ModalController);
  private toastService = inject(ToastService);
  private store = inject(Store);
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

  // addReservation$2 = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(addReservation),
  //     mergeMap((action: any) => {
  //       const requests = [];
  //       this.presentLoading('Creando reservación');
  //       console.log('Payload', action);

  //       if (action.reservationType === 2) {
  //         for (const dto of action.dtoList) {
  //           requests.push(this.reservationService.createReservation(dto));
  //         }
  //       }

  //       if (requests.length) {
  //         return forkJoin(requests).pipe(
  //           tap((responses: any) => {
  //             this.loadingCtrl.dismiss();
  //             this.openSuccessModal();
  //             console.log(responses);
  //             // return addReservationSuccess({ reservation: responses });
  //             return loadReservations();
  //           }),
  //           catchError((error: HttpErrorResponse) => {
  //             this.loadingCtrl.dismiss();

  //             const finalError = error.error;
  //             let errorMessage = '';

  //             if (finalError.message === 'Reservation already exists') {
  //               errorMessage = 'Ya existe esta reservación';
  //             }

  //             if (errorMessage) {
  //               this.toastService.error(errorMessage);
  //             } else {
  //               this.toastService.error(error.error);
  //             }
  //             return of(addReservationFailure({ error }));
  //           })
  //         );
  //       }

  //       if (action.reservationType === 3) {
  //         return this.reservationService
  //           .createChargerReservation(action.dto)
  //           .pipe(
  //             map((reservation) => {
  //               this.loadingCtrl.dismiss();
  //               this.openSuccessModal();
  //               return addReservationSuccess({ reservation });
  //             }),
  //             catchError((error) => {
  //               this.loadingCtrl.dismiss();
  //               return of(addReservationFailure({ error }));
  //             })
  //           );
  //       }

  //       return this.reservationService.createReservation(action.dto).pipe(
  //         map((reservation) => {
  //           this.loadingCtrl.dismiss();
  //           this.openSuccessModal();
  //           return addReservationSuccess({ reservation });
  //         }),
  //         catchError((error: HttpErrorResponse) => {
  //           const finalError = error.error;
  //           let errorMessage = '';

  //           if (finalError.message === 'Reservation already exists') {
  //             errorMessage = 'Ya existe esta reservación';
  //           }

  //           if (errorMessage) {
  //             this.toastService.error(errorMessage);
  //           } else {
  //             this.toastService.error(error.error);
  //           }
  //           this.loadingCtrl.dismiss();
  //           return of(addReservationFailure({ error }));
  //         })
  //       );
  //     })
  //   )
  // );

  addReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addReservation),
      mergeMap((action: any) => {
        this.presentLoading('Creando reservación');
        console.log('Payload', action);

        let request$;

        if (action.reservationType === 2) {
          const requests = action.dtoList.map((dto: any) =>
            this.reservationService.createReservation(dto)
          );
          request$ = forkJoin(requests);
        } else if (action.reservationType === 3) {
          request$ = this.reservationService.createChargerReservation(
            action.dto
          );
        } else {
          request$ = this.reservationService.createReservation(action.dto);
        }

        return request$.pipe(
          map((response) => {
            this.loadingCtrl.dismiss();
            this.openSuccessModal();
            return action.reservationType === 2
              ? loadReservations()
              : addReservationSuccess({ reservation: response });
          }),
          catchError((error: HttpErrorResponse) => {
            this.loadingCtrl.dismiss();
            const finalError = error.error;
            const errorMessage =
              finalError.message === 'Reservation already exists'
                ? 'Ya existe esta reservación'
                : error.error;
            this.toastService.error(errorMessage);
            return of(addReservationFailure({ error }));
          })
        );
      })
    )
  );

  deleteReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteReservation),
      mergeMap((action) => {
        this.presentLoading('Eliminando reservación');
        return this.reservationService.delete(action.reservationId).pipe(
          map(() => {
            this.loadingCtrl.dismiss();
            this.toastService.success('Reservación eliminada');
            return deleteReservationSuccess({
              reservationId: action.reservationId,
            });
          }),
          catchError((error) => {
            this.loadingCtrl.dismiss();
            this.toastService.error('Error al eliminar la reservación');
            return of(deleteReservationFailure({ error }));
          })
        );
      })
    )
  );

  updateReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateReservation),
      mergeMap((action: any) => {
        this.presentLoading('Actualizando reservación');
        return this.reservationService
          .update(action.reservationId, action.dto)
          .pipe(
            map((reservation) => {
              this.loadingCtrl.dismiss();
              this.toastService.success('Reservación actualizada');
              this.modalCtrl.dismiss();
              this.store.dispatch(loadReservations());
              return updateReservationSuccess({ reservation });
            }),
            catchError((error) => {
              const finalError = error.error;
              let errorMessage = '';

              if (finalError.message === 'Reservation already exists') {
                errorMessage = 'Ya existe esta reservación';
              }

              if (errorMessage) {
                this.toastService.error(errorMessage);
              } else {
                this.toastService.error(error.error);
              }
              this.loadingCtrl.dismiss();

              return of(updateReservationFailure({ error }));
            })
          );
      })
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
