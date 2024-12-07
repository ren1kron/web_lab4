// graph.component.ts

import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { NgFor } from '@angular/common';
import { DataService } from '../../services/data.service';
import {Point, PointService} from '../../services/point.service';
import { Subscription } from 'rxjs';

interface PointWithSvg extends Point {
  svgX: number;
  svgY: number;
  color: string;
}

@Component({
  selector: 'app-graph',
  standalone: true,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  imports: [NgFor]
})
export class GraphComponent implements OnInit, OnDestroy {
  @ViewChild('svgElement', { static: true }) svgElement!: ElementRef<SVGElement>;

  @Input() radius: number = 3;

  scale: number = 50;

  svgWidth: number = 500;
  svgHeight: number = 500;
  svgCenterX: number = this.svgWidth / 2;
  svgCenterY: number = this.svgHeight / 2;
  points: PointWithSvg[] = []; // Типизированный массив точек для отображения

  xTicks: { position: number; label: number }[] = [];
  yTicks: { position: number; label: number }[] = [];
  xAxisArrowPoints: string = '';
  yAxisArrowPoints: string = '';

  // Переменные для атрибутов форм
  circlePath: string = '';
  rectX: string = '';
  rectY: string = '';
  rectWidth: string = '';
  rectHeight: string = '';
  trianglePoints: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(private dataService: DataService, private pointService: PointService) {}

  ngOnInit() {
    this.drawAxes();
    this.drawArea();

    // Подписываемся на изменения радиуса
    const radiusSub = this.dataService.radius$.subscribe(r => {
      if (r !== null) {
        this.radius = r;
        this.drawArea();
        // При изменении радиуса пересчитываем координаты точек
        this.updatePoints();
      }
    });
    this.subscriptions.add(radiusSub);

    // Подписываемся на изменения списка точек
    const pointsSub = this.dataService.points$.subscribe(points => {
      this.points = points.map(point => this.transformPoint(point));
    });
    this.subscriptions.add(pointsSub);
  }

  ngOnDestroy() {
    // Отписываемся от всех подписок при уничтожении компонента
    this.subscriptions.unsubscribe();
  }

  drawAxes() {
    this.xTicks = [];
    this.yTicks = [];

    // Определяем диапазон засечек по осям
    const tickInterval = 1; // Интервал между засечками
    const maxTick = Math.ceil(this.svgWidth / 100);
    const minTick = -maxTick;

    // Засечки
    for (let i = minTick; i <= maxTick; i += tickInterval) {
      const positionX = this.svgCenterX + i * this.scale;
      this.xTicks.push({ position: positionX, label: i });

      const positionY = this.svgCenterY - i * this.scale; // Минус, потому что Y в SVG идет вниз
      this.yTicks.push({ position: positionY, label: i });
    }

    // Стрелка на оси X (правый конец)
    this.xAxisArrowPoints = `
      ${this.svgWidth},${this.svgCenterY}
      ${this.svgWidth - 10},${this.svgCenterY - 5}
      ${this.svgWidth - 10},${this.svgCenterY + 5}
    `;

    // Стрелка на оси Y (верхний конец)
    this.yAxisArrowPoints = `
      ${this.svgCenterX},0
      ${this.svgCenterX - 5},10
      ${this.svgCenterX + 5},10
    `;
  }

  drawArea() {
    // Высчитываем радиус
    const r = this.radius * this.scale;
    // Обновляем круг (например, для области попадания)
    this.circlePath = `M ${this.svgCenterX} ${this.svgCenterY}
                     L ${this.svgCenterX} ${this.svgCenterY - r}
                     A ${r} ${r} 0 0 1 ${this.svgCenterX + r} ${this.svgCenterY}
                     Z`;
    // Обновляем квадрат
    this.rectX = `${this.svgCenterX}`;
    this.rectY = `${this.svgCenterY}`;
    this.rectWidth = `${r}`;
    this.rectHeight = `${r / 2}`;
    // Обновляем треугольник
    this.trianglePoints = `
        ${this.svgCenterX},${this.svgCenterY}
        ${this.svgCenterX},${this.svgCenterY + r}
        ${this.svgCenterX - r},${this.svgCenterY}
      `;
  }

  updatePoints() {
    // Обновите координаты точек на графике в соответствии с новым радиусом
    this.points = this.points.map(point => this.transformPoint(point));
  }

  /**
   * Преобразует реальные координаты точки в координаты SVG и определяет цвет точки.
   * @param point Данные точки из сервера.
   * @returns Точка с дополнительными SVG-координатами и цветом.
   */
  transformPoint(point: Point): PointWithSvg {
    const coords = this.toCanvasCoordinates(point.x, point.y);
    return {
      ...point,
      svgX: coords.x,
      svgY: coords.y,
      color: point.hit ? 'green' : 'red'
    };
  }

  /**
   * Добавляет точку на график.
   * @param pointData Данные точки из сервера.
   */
  addPoint(pointData: Point) {
    const pointWithSvg = this.transformPoint(pointData);
    this.points.push(pointWithSvg);
  }

  onGraphClick(event: MouseEvent) {
    const rect = this.svgElement.nativeElement.getBoundingClientRect();
    const svgX = event.clientX - rect.left;
    const svgY = event.clientY - rect.top;

    const coords = this.toRealCoordinates(svgX, svgY);

    const pointData: Point = {
      x: coords.x,
      y: coords.y,
      r: this.radius
    };

    this.pointService.addPoint(pointData).subscribe(
      response => {
        console.log('Точка успешно добавлена: ', response);
        this.dataService.addPoint(response);
      },
      error => {
        console.error('Ошибка при добавлении точки: ', error);
      }
    );
  }

  toRealCoordinates(svgX: number, svgY: number): { x: number; y: number } {
    const x = (svgX - this.svgCenterX) / this.scale;
    const y = (this.svgCenterY - svgY) / this.scale;
    return { x, y };
  }

  toCanvasCoordinates(x: number, y: number): { x: number; y: number } {
    const svgX = this.svgCenterX + x * this.scale;
    const svgY = this.svgCenterY - y * this.scale;
    return { x: svgX, y: svgY };
  }
}
