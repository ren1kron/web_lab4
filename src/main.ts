import { bootstrapApplication } from '@angular/platform-browser';
import {provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi, withInterceptors} from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
}).catch((err) => console.error(err));
