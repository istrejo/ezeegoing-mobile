import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { BuildingModalComponent } from 'src/app/shared/components/building-modal/building-modal.component';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { selectBuilding } from '../actions/building.actions';
import { TokenService } from 'src/app/core/services/token/token.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private modalCtrl = inject(ModalController);
  private store = inject(Store);
  private tokenService = inject(TokenService);

  constructor() {}

  /* This code snippet defines an effect called `login$` using the `createEffect` function provided by
`@ngrx/effects`. The purpose of this effect is to handle the `login` action dispatched in the
application. */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action: any) => {
        const { username, password, id } = action;
        this.presentLoading();
        return this.authService.login(username, password, id).pipe(
          map((userData) => {
            const buildingSelected = localStorage.getItem('buildingId');
            if (!buildingSelected) {
              this.openBuildingModal();
            }
            this.router.navigate(['/tabs/reserve']);
            this.loadingCtrl.dismiss();
            localStorage.setItem('userData', JSON.stringify(userData));
            this.tokenService.saveToken(userData.access_token);
            this.tokenService.saveRefreshToken(userData.refresh_token);
            return AuthActions.loginSuccess({ userData });
          }),
          catchError(({ error }) => {
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
            return of(AuthActions.loginFailure({ error }));
          })
        );
      })
    )
  );

  /* The `logout$` effect is defined using the `createEffect` function provided by `@ngrx/effects`. This
 effect is triggered when the `logout` action is dispatched in the application. Here is a breakdown
 of what the `logout$` effect is doing: */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() => {
        this.presentLoading();
        return this.authService.logout().pipe(
          tap(() => {
            this.tokenService.removeToken();
            this.tokenService.removeRefreshToken();
            localStorage.removeItem('userData');
            localStorage.removeItem('buildingId');
            localStorage.removeItem('currentBuilding');
            this.router.navigate(['/login'], {
              replaceUrl: true,
            });
            this.loadingCtrl.dismiss();
            this.store.dispatch(selectBuilding({ buildingId: null }));
          }),
          switchMap(() => [
            AuthActions.logoutSuccess(),
            AuthActions.clearStore(),
          ]),
          catchError((error) => {
            this.loadingCtrl.dismiss();
            console.log('Logout effect error response: ', error);
            // TODO: Esta condición debe ser removida si el token interceptor ya bora dichos datos
            if (error.status === 400) {
              this.tokenService.removeToken();
              this.tokenService.removeRefreshToken();
              localStorage.removeItem('userData');
              localStorage.removeItem('buildingId');
              this.router.navigate(['/login'], {
                replaceUrl: true,
              });
              this.store.dispatch(selectBuilding({ buildingId: null }));
            }
            return of(AuthActions.logoutFailure({ error }));
          })
        );
      })
    )
  );

  /* The `presentLoading()` function is an asynchronous function that creates and presents a loading
spinner using the `LoadingController` provided by Ionic. */
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      mode: 'ios',
    });
    await loading.present();
  }

  /**
   * The openBuildingModal function asynchronously creates and presents a modal component for a building.
   */
  async openBuildingModal() {
    const modal = await this.modalCtrl.create({
      component: BuildingModalComponent,
    });
    await modal.present();
  }
}
