// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
//
// @Injectable({providedIn: 'root'})
// export class AuthService {
//   private apiUrl = 'http://localhost:8080/web_lab4/api'; // Ваш бэкенд
//   private tokenKey = 'authToken';
//
//   constructor(private http: HttpClient) {}
//
//   login(username: string, password: string) {
//     return this.http.post<{token: string}>(`${this.apiUrl}/login`, {username, password});
//   }
//
//   setToken(token: string) {
//     localStorage.setItem(this.tokenKey, token);
//   }
//
//   getToken(): string | null {
//     return localStorage.getItem(this.tokenKey);
//   }
//
//   isLoggedIn(): boolean {
//     return !!this.getToken();
//   }
//
//   logout() {
//     localStorage.removeItem(this.tokenKey);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/web_lab4/api'; // Ваш бэкенд
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      catchError(error => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}
