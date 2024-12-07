import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Point } from '../../services/point.service';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.scss'], // Исправлено на styleUrls
  standalone: true,
  imports: [NgFor]
})
export class ResultTableComponent implements OnInit, OnDestroy {
  results: Point[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.subscription = this.dataService.points$.subscribe(
      (points: Point[]) => {
        this.results = points;
      },
      (error: any) => {
        console.error('Ошибка при получении точек:', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
