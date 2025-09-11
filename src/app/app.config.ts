import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthStateService } from './shared/data-access/auth.state.service';
import { environment } from 'src/environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: authInterceptor, multi: true },
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: AuthStateService.token,
          allowedDomains: [environment.API_URL],
          disallowedRoutes: [environment.API_URL],
        },
      })
    ),
  ],
};
