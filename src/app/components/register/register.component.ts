import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // If using template-driven forms
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please provide both username and password.';
      return;
    }

    this.isLoading = true;

    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        // Store the received token
        this.authService.setToken(response.token);
        this.isLoading = false;
        // Redirect to the main page or login page as needed
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.errorMessage = 'Registration failed. Try another username.';
        this.isLoading = false;
      }
    });
  }
}
