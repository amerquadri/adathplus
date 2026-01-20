import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { RuntimeConfigService } from './runtime-config.service';
import { ErrorInterceptor } from './error.interceptor';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNativeDateAdapter(),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // Load runtime config before app starts. Put a `config.json` at your server root (public/config.json -> /config.json)
    { provide: APP_INITIALIZER, multi: true, useFactory: (rc: RuntimeConfigService) => () => rc.load(), deps: [RuntimeConfigService] }
  ]
};
