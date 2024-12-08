import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard triggered. isLoggedIn:', authService.isLoggedIn());

  return of(authService.isLoggedIn()).pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        console.warn('User is not authorized. Redirecting to login...');
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    }),
    catchError(error => {
      console.error('Error checking authorization:', error);
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return of(false);
    })
  );
};

