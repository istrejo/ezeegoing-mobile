import {
  HttpContext,
  HttpContextToken,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../core/services/token/token.service';
import { switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { Store } from '@ngrx/store';
import { logout } from 'src/app/state/actions/auth.actions';
import { Router } from '@angular/router';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  if (req.context.get(CHECK_TOKEN)) {
    const isValidToken = tokenService.isValidToken();
    if (isValidToken) {
      return addToken(req, next);
    } else {
      return updateAccessTokenAndRefreshToken(req, next);
    }
  }
  return next(req);
};

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

function addToken(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const tokenService = inject(TokenService);

  const accesstoken = tokenService.getToken();
  if (accesstoken) {
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accesstoken}`),
    });
    return next(authRequest);
  }
  return next(req);
}

function updateAccessTokenAndRefreshToken(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const alertService = inject(AlertService);
  const router = inject(Router);
  const refreshToken = tokenService.getRefreshToken();
  const isValidRefreshToken = tokenService.isValidRefreshToken();

  if (refreshToken && isValidRefreshToken) {
    return authService
      .refreshToken(refreshToken)
      .pipe(switchMap(() => addToken(req, next)));
  }

  if (!isValidRefreshToken) {
    alertService.presentAlert({
      mode: 'ios',
      header: 'Error',
      message: 'Sesión expirada. Porfavor,vuelve a iniciar sesión.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            tokenService.removeToken();
            tokenService.removeRefreshToken();
            localStorage.removeItem('userData');
            localStorage.removeItem('buildingId');
            router.navigate(['/login']);
          },
        },
      ],
      backdropDismiss: false,
    });
  }

  return next(req);
}
