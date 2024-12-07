// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthService } from '../services/auth.service';
//
// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService) {}
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = this.authService.getToken();
//     if (token && !req.url.endsWith('/login')) {
//       const cloned = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       return next.handle(cloned);
//     }
//     return next.handle(req);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    // const token = 'simpletoken-1733580406120-testuser';

    if (token && !req.url.endsWith('/login')) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('AuthInterceptor: Added Authorization header');
      return next.handle(cloned).pipe(
        catchError(error => this.handleError(error))
      );
    }

    return next.handle(req).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > expiryTime;
    } catch (e) {
      console.error('Ошибка при проверке срока действия токена:', e);
      return true; // Если токен некорректен, считаем его истекшим
    }
  }

  private handleError(error: any): Observable<never> {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      console.warn('AuthInterceptor: 401 Unauthorized. Redirecting to login.');
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    return throwError(() => new Error('An error occurred during the request.'));
  }
}
