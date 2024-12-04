import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgFor, NgIf} from '@angular/common';
import { FormGraphService } from '../../servives/form-graph.service';

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

  constructor(private formGraphService: FormGraphService) {}

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
      this.formGraphService.setRadius(0);
    } else {
      this.selectedRValue = value;
      this.formGraphService.setRadius(value);
    }
    // Триггер перерисовки графика при изменении R
    // this.radiusChanged();
  }

  // radiusChanged() {
  //   // Логика для обновления графика при изменении R
  //   // Можно использовать сервис или Output EventEmitter для оповещения GraphComponent
  // }

  onSubmit() {
    if (this.validateInputs()) {
      // Логика отправки данных на сервер и обновления графика и таблицы результатов
      const data = {
        x: this.selectedXValue!,
        y: parseFloat(this.y),
        r: this.selectedRValue!
      };
      console.log('Отправка данных: ', data)

      this.formGraphService.addPoint(data);

      // отправка на сервер...
    }
  }

  validateInputs(): boolean {
    let isValid = true;

    // Проверка X
    if (this.selectedXValue === 0) {
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
    if (this.selectedRValue === 0) {
      this.errorR = 'Необходимо выбрать значение R.';
      isValid = false;
    } else {
      this.errorR = '';
    }

    return isValid;
  }
}
