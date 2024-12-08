import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false; // Индикатор загрузки

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Введите логин и пароль.';
      return;
    }

    this.isLoading = true; // Включение индикатора загрузки

    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.setToken(response.token); // Сохраняем токен
        this.isLoading = false;
        // this.router.navigate([returnUrl]); // Редирект на запрашиваемую страницу
        this.router.navigate([returnUrl]); // Редирект на запрашиваемую страницу
      },
      error: (error) => {
        console.error('Ошибка при авторизации:', error);
        this.errorMessage = 'Неверный логин или пароль.';
        this.isLoading = false; // Отключение индикатора загрузки
      }
    });
  }
}
