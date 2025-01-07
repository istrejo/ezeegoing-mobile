import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from 'src/app/core/services/token/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenservice = inject(TokenService);
  const router = inject(Router);
  const isValidToken = tokenservice.isValidRefreshToken();
  console.log('Is valid token from AuthGuard: ', isValidToken);

  if (!isValidToken) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
