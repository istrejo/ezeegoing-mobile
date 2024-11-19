import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action: any) => {
        const { username, password } = action.credentials;
        return this.authService.login(username, password).pipe(
          map((userData) => {
            localStorage.setItem('userData', JSON.stringify(userData));
            return AuthActions.loginSuccess(userData);
          }),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        );
      })
    )
  );

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
