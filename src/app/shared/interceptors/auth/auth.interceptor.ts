import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, switchMap, throwError } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import {
  logout,
  updateAccessToken,
  updateRefreshToken,
} from 'src/app/state/actions/auth.actions';
import { environment } from 'src/environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const alertService = inject(AlertService);
  const apiKey = environment.apiSecretKey;
  const store = inject(Store);
  const token = authService.token;

  if (
    /* This part of the code is checking if the URL of the HTTP request (`req`) includes certain keywords
such as 'login', 'logout', or 'refresh'. If the URL contains any of these keywords, it means that
the request is related to user authentication actions like logging in, logging out, or refreshing
tokens. */
    req.url.includes('login') ||
    req.url.includes('logout') ||
    req.url.includes('refresh')
  ) {
    const cloneRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
    });
    return next(cloneRequest);
  }

  /* This part of the code is creating a new HTTP request (`authReq`) by cloning the original request
(`req`) and adding additional headers to it. Specifically, it is setting the headers for
Authorization, Content-Type, and X-API-KEY in the request. The Authorization header is set with a
Bearer token obtained from the `token()` function provided by the `AuthService`, the Content-Type
header is set to 'application/json', and the X-API-KEY header is set to the value of the `apiKey`
variable from the environment configuration. This new request is then returned to be executed with
the updated headers. */
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
  });

  /* This part of the code is handling the scenario where an HTTP request encounters an error,
specifically an `HttpErrorResponse`. */
  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 403 || err.status === 400) {
        return authService.refreshToken().pipe(
          switchMap((res) => {
            localStorage.setItem('accessToken', res.access_token);
            localStorage.setItem('refreshToken', res.refresh_token);
            store.dispatch(
              updateAccessToken({ access_token: res.access_token })
            );
            store.dispatch(
              updateRefreshToken({ refresh_token: res.refresh_token })
            );

            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token()}`,
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
              },
            });

            return next(newReq);
          }),
          catchError((refreshErr) => {
            const finalError = new Error(refreshErr);
            if (refreshErr.status === 401 || refreshErr.status === 403) {
              alertService.presentAlert({
                mode: 'ios',
                header: 'Error',
                message: 'Sesión expirada. Porfavor,vuelve a iniciar sesión.',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      store.dispatch(logout());
                    },
                  },
                ],
                backdropDismiss: false,
              });
            }

            return throwError(() => finalError);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
