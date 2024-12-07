// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { Router } from '@angular/router';
// import { NgIf } from '@angular/common';
//
// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, NgIf],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss'
// })
// export class LoginComponent {
//   username = '';
//   password = '';
//   errorMessage = '';
//
//   constructor(private authService: AuthService, private router: Router) {}
//
//   onSubmit() {
//     this.authService.login(this.username, this.password).subscribe(
//       response => {
//         // Предполагается, что ответ содержит {token: '...'}
//         this.authService.setToken(response.token);
//         this.router.navigate(['/']);
//       },
//       error => {
//         console.error('Ошибка при авторизации:', error);
//         this.errorMessage = 'Неверный логин или пароль.';
//       }
//     );
//   }
// }
//


import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
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
        this.router.navigate(['/']); // Редирект на запрашиваемую страницу
      },
      error: (error) => {
        console.error('Ошибка при авторизации:', error);
        this.errorMessage = 'Неверный логин или пароль.';
        this.isLoading = false; // Отключение индикатора загрузки
      }
    });
  }
}
