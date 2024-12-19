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

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private modalCtrl = inject(ModalController);
  private store = inject(Store);

  constructor() {}

  /* This code snippet defines an effect called `login$` using the `createEffect` function provided by
`@ngrx/effects`. The purpose of this effect is to handle the `login` action dispatched in the
application. */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action: any) => {
        const { username, password } = action;
        this.presentLoading();
        return this.authService.login(username, password).pipe(
          map((userData) => {
            this.openBuildingModal();
            this.router.navigate(['/tabs/reserve']);
            this.loadingCtrl.dismiss();
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('accessToken', userData.access_token);
            localStorage.setItem('refreshToken', userData.refresh_token);
            return AuthActions.loginSuccess({ userData });
          }),
          catchError((error) => {
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
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('buildingId');
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
