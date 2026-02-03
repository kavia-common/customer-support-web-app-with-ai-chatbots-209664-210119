import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// PUBLIC_INTERFACE
/**
 * Frontend entrypoint: bootstraps the Angular application.
 */
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
