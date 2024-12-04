import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import {NgFor} from '@angular/common';


@Component({
  selector: 'app-graph',
  standalone: true,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  imports: [NgFor]
})
export class GraphComponent implements OnInit {
  @ViewChild('svgElement', { static: true }) svgElement!: ElementRef<SVGElement>;

  @Input() radius: number = 1;

  svgWidth: number = 500;
  svgHeight: number = 500;
  points: any[] = []; // Массив точек для отображения

  areaPath: string = ''; // Путь для области (зависит от вашего варианта)

  ngOnInit() {
    this.drawArea();
  }

  ngOnChanges() {
    this.drawArea();
    this.updatePoints();
  }

  drawArea() {
    // Обновите путь для области в зависимости от радиуса
    // Пример для четверти круга
    const r = this.radius * (this.svgWidth / (this.radius * 2));
    this.areaPath = `M ${this.svgWidth / 2} ${this.svgHeight / 2}
                     L ${this.svgWidth / 2} ${this.svgHeight / 2 - r}
                     A ${r} ${r} 0 0 1 ${this.svgWidth / 2 + r} ${this.svgHeight / 2}
                     Z`;
  }

  updatePoints() {
    // Обновите координаты точек на графике в соответствии с новым радиусом
    this.points.forEach(point => {
      const coords = this.toCanvasCoordinates(point.x, point.y);
      point.svgX = coords.x;
      point.svgY = coords.y;
    });
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
    // Преобразование координат SVG в реальные координаты
    const x = ((svgX - this.svgWidth / 2) / (this.svgWidth / 2)) * this.radius;
    const y = -((svgY - this.svgHeight / 2) / (this.svgHeight / 2)) * this.radius;
    return { x, y };
  }

  toCanvasCoordinates(x: number, y: number): { x: number; y: number } {
    // Преобразование реальных координат в координаты SVG
    const svgX = (x / this.radius) * (this.svgWidth / 2) + this.svgWidth / 2;
    const svgY = this.svgHeight / 2 - (y / this.radius) * (this.svgHeight / 2);
    return { x: svgX, y: svgY };
  }
}

//
// @Component({
//     selector: 'app-graph',
//   imports: [
//     NgForOf
//   ],
//     templateUrl: './graph.component.html',
//     standalone: true,
//     styleUrl: './graph.component.scss'
// })
// export class GraphComponent {
//
// }
