import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormGraphService {
  private radiusSubject = new BehaviorSubject<number | null>(null);
  radius$ = this.radiusSubject.asObservable();

  private pointSubject = new BehaviorSubject<{ x: number; y: number; r: number } | null>(null);
  point$ = this.pointSubject.asObservable();

  setRadius(r: number) {
    this.radiusSubject.next(r);
  }

  addPoint(point: { x: number; y: number; r: number }) {
    this.pointSubject.next(point);
  }
}
