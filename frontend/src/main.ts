import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    console.error('Error bootstrapping application:', err);
    document.body.innerHTML = `<div style="padding: 20px; color: red;">
      <h1>Application Error</h1>
      <p>${err.message || 'Unknown error occurred'}</p>
      <pre>${err.stack || ''}</pre>
    </div>`;
  });
