import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme: 'light' | 'dark' = 'dark';

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.body.className = `theme-${this.currentTheme}`;
  }

  getTheme(): string {
    return this.currentTheme;
  }
}
