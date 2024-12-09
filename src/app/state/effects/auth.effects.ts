import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { BuildingModalComponent } from 'src/app/shared/components/building-modal/building-modal.component';

@Injectable()
export class AuthEffects {
  private loadingSvc = inject(LoadingService);
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalSvc = inject(ModalService);
  constructor() {}

  /* This code snippet defines an effect called `login$` using the `createEffect` function provided by
`@ngrx/effects`. The purpose of this effect is to handle the `login` action dispatched in the
application. */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action: any) => {
        const { username, password } = action;
        this.loadingSvc.present();
        return this.authService.login(username, password).pipe(
          map((userData) => {
            this.modalSvc.presentModal(BuildingModalComponent);
            this.router.navigate(['/tabs/home']);
            this.loadingSvc.dismiss();
            localStorage.setItem('userData', JSON.stringify(userData));
            return AuthActions.loginSuccess({ userData });
          }),
          catchError((error) => {
            this.loadingSvc.dismiss();
            return of(AuthActions.loginFailure({ error }));
          })
        );
      })
    )
  );

  /* The `logout$` effect is defined using the `createEffect` function provided by `@ngrx/effects`. This
 effect is triggered when the `logout` action is dispatched in the application. */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          switchMap(() => [
            AuthActions.logoutSuccess(),
            AuthActions.clearStore(),
          ]),
          catchError((error) => of(AuthActions.logoutFailure({ error })))
        )
      )
    )
  );
}
