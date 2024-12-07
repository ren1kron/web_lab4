// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import {PointService, Point} from './point.service';
//
// @Injectable({
//   providedIn: 'root'
// })
//
// export class DataService {
//   private radiusSubject = new BehaviorSubject<number | null>(null);
//   radius$ = this.radiusSubject.asObservable();
//
//   private pointSubject = new BehaviorSubject<Point | null>(null);
//   point$ = this.pointSubject.asObservable();
//
//   private pointsSubject = new BehaviorSubject<Point[]>([]);
//   points$ = this.pointsSubject.asObservable();
//
//   constructor(private pointService: PointService) {
//     // Загрузка точек при инициализации
//     this.pointService.getPoints().subscribe(
//       points => {
//         this.pointsSubject.next(points);
//       },
//       error => {
//         console.error('Ошибка при загрузке точек:', error);
//       }
//     );
//   }
//
//   setRadius(r: number) {
//     this.radiusSubject.next(r);
//   }
//
//   addPoint(point: Point) {
//     // Добавляем точку в локальный список
//     const currentPoints = this.pointsSubject.value;
//     currentPoints.push(point);
//     this.pointsSubject.next(currentPoints);
//
//     // Эмитируем отдельное событие для обновления графика
//     this.pointSubject.next(point);
//   }
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PointService, Point } from './point.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private radiusSubject = new BehaviorSubject<number | null>(null);
  radius$ = this.radiusSubject.asObservable();

  private pointSubject = new BehaviorSubject<Point | null>(null);
  point$ = this.pointSubject.asObservable();

  private pointsSubject = new BehaviorSubject<Point[]>([]); // Инициализация пустым массивом
  points$ = this.pointsSubject.asObservable();

  constructor(private pointService: PointService) {
    // Загрузка точек при инициализации с использованием tap и обработки ошибок
    this.pointService.getPoints().pipe(
      tap(points => this.pointsSubject.next(points)),
      catchError(error => {
        console.error('Ошибка при загрузке точек:', error);
        return throwError(() => new Error('Не удалось загрузить точки.'));
      })
    ).subscribe({
      error: err => console.error('Ошибка при подписке на точки:', err)
    });
  }

  setRadius(r: number) {
    this.radiusSubject.next(r);
  }

  addPoint(point: Point) {
    if (this.validatePoint(point)) {
      // Добавляем точку в локальный список
      const currentPoints = this.pointsSubject.value;
      this.pointsSubject.next([...currentPoints, point]); // Используем копию массива

      // Эмитируем отдельное событие для обновления графика
      this.pointSubject.next(point);
    } else {
      console.error('Недопустимый формат точки:', point);
    }
  }

  private validatePoint(point: any): point is Point {
    return point && typeof point.x === 'number' && typeof point.y === 'number' && typeof point.r === 'number';
  }
}
