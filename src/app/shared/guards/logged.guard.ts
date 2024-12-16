import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { selectIsAuthenticated } from 'src/app/state/selectors/auth.selectors';

export const loggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsAuthenticated).pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigate(['/tabs']);
        return false;
      }
      return true;
    })
  ) as Observable<boolean>;
};
