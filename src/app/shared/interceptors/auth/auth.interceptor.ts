import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'src/app/core/services/localstorage/localstorage.service';
import { selectAccessToken } from 'src/app/state/selectors/auth.selectors';
import { environment } from 'src/environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = environment.apiSecretKey;
  const store = inject(Store);
  const localStorageSvc = inject(LocalStorageService);
  const accessToken = localStorageSvc.getItem('userData')?.access_token;

  if (req.url.includes('login')) {
    console.log('Token login: ', accessToken);
    const cloneRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey, // Sustituye esto con tu clave de API
      },
    });
    return next(cloneRequest);
  }
  console.log('Token: ', accessToken);

  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey, // Sustituye esto con tu clave de API
    },
  });
  return next(cloneRequest);
};
