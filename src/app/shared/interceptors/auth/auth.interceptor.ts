import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const apiKey = environment.apiSecretKey;

  const token = authService.getAuthToken();

  if (req.url.includes('login') || req.url.includes('logout')) {
    console.log('Token login: ', token);
    const cloneRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
    });
    return next(cloneRequest);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
  });

  // return next(authReq).pipe(
  //   catchError((err) => {
  //     console.error('Interceptor Error: ', err);
  //     // return throwError(() => err);
  //     return authService.refreshToken().pipe(
  //       switchMap((res) => {
  //         // Save token in local storage
  //         localStorage.setItem('accessToken', res.access_token);
  //         localStorage.setItem('refreshToken', res.refresh_token);
  //         const newReq = req.clone({
  //           setHeaders: {
  //             Authorization: `Bearer ${res.access_token}`,
  //             'X-API-KEY': apiKey,
  //           },
  //         });
  //         return next(newReq);
  //       }),
  //       catchError((refreshError) => {
  //         console.error('Refresh Token Error: ', refreshError);
  //         // Handle the error appropriately, e.g., log out the user
  //         store.dispatch(logout());
  //         return throwError(() => new Error(refreshError));
  //       })
  //     );
  //   })
  // );

  return next(authReq);
};
