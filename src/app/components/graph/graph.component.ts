import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormGraphService } from '../../servives/form-graph.service';

@Component({
  selector: 'app-graph',
  standalone: true,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  imports: [NgFor]
})

export class GraphComponent implements OnInit {
  @ViewChild('svgElement', { static: true }) svgElement!: ElementRef<SVGElement>;

  @Input() radius: number = 0;

  scale: number = 1;

  svgWidth: number = 500;
  svgHeight: number = 500;
  svgCenterX: number = this.svgWidth / 2;
  svgCenterY: number = this.svgHeight / 2;
  points: any[] = []; // Массив точек для отображения

  xTicks: {position: number; label: number}[] = [];
  yTicks: {position: number; label: number}[] = [];
  xAxisArrowPoints: string = '';
  yAxisArrowPoints: string = '';

  // переменные для атрибутов форм
  circlePath: string = '';

  rectX: string = '';
  rectY: string = '';
  rectWidth: string = '';
  rectHeight: string = '';

  trianglePoints: string = '';

  constructor(private formGraphService: FormGraphService) {}

  ngOnInit() {
    this.drawArea();

    this.calculateScale();

    // подписываемся на изменения радиуса
    this.formGraphService.radius$.subscribe(r => {
      if (r !== null) {
        this.radius = r;
        this.drawArea();
        this.updatePoints();
      }
    });

    // подписываемся на добавление точек
    this.formGraphService.point$.subscribe(point => {
      if (point) {
        this.addPoint(point);
      }
    })
    // подписываемся на изменения радиуса
    this.formGraphService.radius$.subscribe(r => {
      if (r !== null) {
        this.radius = r;
        this.calculateScale();
        this.drawArea();
        this.drawAxes();
        this.updatePoints();
      }
    });

    this.drawAxes();
  }

  calculateScale() {
    this.scale = (this.svgCenterX) / this.radius / 2;
  }

  drawAxes() {
    this.xTicks = [];
    this.yTicks = [];

    // Определяем диапазон засечек по осям
    const tickInterval = 1; // Интервал между засечками
    const maxTick = Math.ceil(this.radius);
    const minTick = -maxTick;

    // Засечки по X
    for (let i = minTick; i <= maxTick; i += tickInterval) {
      const position = this.svgCenterX + i * this.scale;
      this.xTicks.push({ position, label: i });
    }

    // Засечки по Y
    for (let i = minTick; i <= maxTick; i += tickInterval) {
      const position = this.svgCenterY - i * this.scale; // Минус, потому что Y в SVG идет вниз
      this.yTicks.push({ position, label: i });
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

  ngOnChanges() {
    this.drawArea();
    this.updatePoints();
  }

  drawArea() {
    // высчитываем радиус
    const r = this.radius * this.scale;
    // обновляем круг
    this.circlePath = `M ${this.svgCenterX} ${this.svgCenterY}
                     L ${this.svgCenterX} ${this.svgCenterY - r}
                     A ${r} ${r} 0 0 1 ${this.svgCenterX + r} ${this.svgCenterY}
                     Z`;
    // обновляем квадрат
    this.rectX = `${this.svgCenterX}`;
    this.rectY = `${this.svgCenterY}`;
    this.rectWidth  = `${r}`;
    this.rectHeight = `${r/2}`;
    // обновляем треугольник
    this.trianglePoints = `
        ${this.svgCenterX},${this.svgCenterY}
        ${this.svgCenterX},${this.svgCenterY + r}
        ${this.svgCenterX - r},${this.svgCenterY}
      `

  }

  updatePoints() {
    // Обновите координаты точек на графике в соответствии с новым радиусом
    this.points.forEach(point => {
      const coords = this.toCanvasCoordinates(point.x, point.y);
      point.svgX = coords.x;
      point.svgY = coords.y;
    });
  }

  addPoint(pointData: {x: number; y: number; r: number}) {
    // Проверяем попадание точки в область
    const hit = this.checkHit(pointData.x, pointData.y, pointData.r);
    const coords = this.toCanvasCoordinates(pointData.x, pointData.y);
    const point = {
      x: pointData.x,
      y: pointData.y,
      r: pointData.r,
      hit: hit,
      svgX: coords.x,
      svgY: coords.y,
      color: hit ? 'green' : 'red'
    };
    this.points.push(point);
  }

  onGraphClick(event: MouseEvent) {
    const rect = this.svgElement.nativeElement.getBoundingClientRect();
    const svgX = event.clientX - rect.left;
    const svgY = event.clientY - rect.top;

    const coords = this.toRealCoordinates(svgX, svgY);

    // Отправьте координаты на сервер для проверки попадания
    // Затем добавьте точку в массив points с результатом
    const point = {
      x: coords.x,
      y: coords.y,
      r: this.radius,
      hit: false, // Замените на результат с сервера
      svgX: svgX,
      svgY: svgY,
      color: 'red' // Замените цвет в зависимости от попадания
    };

    // Добавьте точку в массив и обновите отображение
    this.points.push(point);
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

  checkHit(x: number, y: number, r: number): boolean {
    return false;
  }
}
