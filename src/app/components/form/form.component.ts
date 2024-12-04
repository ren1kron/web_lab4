import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [NgFor, NgIf, FormsModule]
})
export class FormComponent {
  xValues: number[] = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
  rValues: number[] = [-5, -4, -3, -2, -1, 0, 1, 2, 3];

  selectedXValues: number[] = [];
  selectedRValues: number[] = [];
  y: string = '';

  errorX: string = '';
  errorY: string = '';
  errorR: string = '';

  onXChange(value: number, event: any) {
    if (event.target.checked) {
      this.selectedXValues.push(value);
    } else {
      this.selectedXValues = this.selectedXValues.filter(val => val !== value);
    }
  }

  onRChange(value: number, event: any) {
    if (event.target.checked) {
      this.selectedRValues.push(value);
    } else {
      this.selectedRValues = this.selectedRValues.filter(val => val !== value);
    }
    // Триггер перерисовки графика при изменении R
    this.radiusChanged();
  }

  radiusChanged() {
    // Логика для обновления графика при изменении R
    // Можно использовать сервис или Output EventEmitter для оповещения GraphComponent
  }

  onSubmit() {
    if (this.validateInputs()) {
      // Логика отправки данных на сервер и обновления графика и таблицы результатов
      const data = {
        x: this.selectedXValues,
        y: parseFloat(this.y),
        r: this.selectedRValues
      };
      // Отправьте данные в сервис или напрямую в компонент графика
    }
  }

  validateInputs(): boolean {
    let isValid = true;

    // Проверка X
    if (this.selectedXValues.length === 0) {
      this.errorX = 'Необходимо выбрать хотя бы одно значение X.';
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
    if (this.selectedRValues.length === 0) {
      this.errorR = 'Необходимо выбрать хотя бы одно значение R.';
      isValid = false;
    } else {
      this.errorR = '';
    }

    return isValid;
  }
}
