import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = environment.apiSecretKey;
  const cloneRequest = req.clone({
    setHeaders: {
      // Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey, // Sustituye esto con tu clave de API
    },
  });
  return next(cloneRequest);
};
