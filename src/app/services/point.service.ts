import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Point {
  id?: number;
  x: number;
  y: number;
  r: number;
  hitTime?: Date;
  hit?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PointService {
  private apiUrl = 'http://localhost:8080/web_lab4/api/points'

  constructor(private http: HttpClient) {}

  // Получение списка точек
  getPoints(): Observable<Point[]> {
    return this.http.get<Point[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Ошибка при получении точек:', error);
        return throwError(() => new Error('Не удалось получить список точек.'));
      })
    );
  }

  // Добавление новой точки
  addPoint(point: Point): Observable<Point> {
    return this.http.post<Point>(this.apiUrl, point).pipe(
      catchError(error => {
        console.error('Ошибка при добавлении точки:', error);
        return throwError(() => new Error('Не удалось добавить точку.'));
      })
    );
  }

  // Удаление всех точек
  clearPoints(): Observable<string> {
    return this.http.delete<string>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Ошибка при удалении точек:', error);
        return throwError(() => new Error('Не удалось удалить точки.'));
      })
    );
  }
}
