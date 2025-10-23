import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
// Configure MarkdownModule avec HttpClient
    importProvidersFrom(MarkdownModule.forRoot({ loader: HttpClient })),
  ]
};
