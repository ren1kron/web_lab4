import { Component } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {NgFor, NgIf} from '@angular/common';
import { PointService, Point } from '../../services/point.service';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [NgFor, NgIf, FormsModule]
})
export class FormComponent {
  // TODO нужно:
  //  - починить checkbox'ы
  //  - добавить связь между формой и графиком
  //  -
  //  -
  xValues: number[] = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
  // rValues: number[] = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
  rValues: number[] = [1, 2, 3, 4, 5];

  selectedXValue: number | null = null;
  selectedRValue: number | null = null;
  y: string = '';

  errorX: string = '';
  errorY: string = '';
  errorR: string = '';

  constructor(private dataService: DataService, private pointService: PointService) {}

  onXChange(value: number) {
    if (this.selectedXValue === value) {
      this.selectedXValue = null; // Снять выбор, если нажали на уже выбранный чекбокс
    } else {
      this.selectedXValue = value;
    }
  }

  onRChange(value: number) {
    if (this.selectedRValue === value) {
      this.selectedRValue = null; // Снять выбор, если нажали на уже выбранный чекбокс
      this.dataService.setRadius(0);
    } else {
      this.selectedRValue = value;
      this.dataService.setRadius(value);
    }
  }

  onSubmit() {
    if (this.validateInputs()) {
      // Логика отправки данных на сервер и обновления графика и таблицы результатов
      const point: Point = {
        x: this.selectedXValue!,
        y: parseFloat(this.y),
        r: this.selectedRValue!
      };
      console.log('Отправка данных: ', point)

      // this.dataService.addPoint(data);

      this.pointService.addPoint(point).subscribe(
        response => {
          console.log('Точка успешно добавлена: ', response);

          // передаём в DataService для обновления графика и таблицы
          this.dataService.addPoint(response);
        },
        error => {
          console.error('Ошибка при добавлении точки: ', error);
        }
      );
    }
  }

  validateInputs(): boolean {
    let isValid = true;

    // Проверка X
    if (this.selectedXValue == null) {
      this.errorX = 'Необходимо выбрать значение X.';
      isValid = false;
    } else {
      this.errorX = '';
    }

    // Проверка Y
    const yValue = parseFloat(this.y);
    if (isNaN(yValue) || yValue < -3 || yValue > 3) {
      this.errorY = 'Y должен быть числом от -3 до 3.';
      isValid = false;
    } else {
      this.errorY = '';
    }

    // Проверка R
    if (this.selectedRValue == null) {
      this.errorR = 'Необходимо выбрать значение R.';
      isValid = false;
    } else if (this.selectedRValue <= 0) {
      this.errorR = 'R - значение радиуса, оно обязано быть больше 0'
      isValid = false;
    } else {
      this.errorR = '';
    }

    return isValid;
  }
  /**
   * Метод для обработки очистки формы и удаления всех точек.
   * @param form Ссылка на форму для её сброса.
   */
  onClear(form: NgForm): void {
    // Подтверждение действия
    if (!confirm('Вы уверены, что хотите очистить все точки?')) {
      return;
    }

    // Вызов сервиса для очистки точек на сервере
    this.pointService.clearPoints().subscribe(
      response => {
        console.log('Точки успешно очищены:', response);
        // Обновление локального списка точек через DataService
        this.pointService.clearPoints(); // Предполагается, что в DataService есть такой метод
        // Сброс формы до исходных значений
        form.resetForm({
          selectedXValue: null,
          y: null,
          selectedRValue: null
        });
      },
      error => {
        console.error('Ошибка при очистке точек:', error);
        // Здесь можно добавить отображение ошибки пользователю
      }
    );
  }
}
