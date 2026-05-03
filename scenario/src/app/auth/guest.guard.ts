import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

export const guestGuard: CanActivateFn = (): Observable<boolean | ReturnType<Router['createUrlTree']>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUserValue) {
    return of(router.createUrlTree(['/tasks']))
  }

  return authService.loadCurrentUser().pipe(
    map((user) => user ? router.createUrlTree(['/tasks']) : true),
  )
}
