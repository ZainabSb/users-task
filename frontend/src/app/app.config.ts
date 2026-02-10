import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset, palette } from '@primeuix/themes';
import { usersFeature } from './store/users/users.reducer';
import { UsersEffects } from './store/users/users.effects';

const DEFAULT_PRIMARY = '#10b981';

const AppPreset = definePreset(Aura, {
  semantic: {
    primary: palette(DEFAULT_PRIMARY) 
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    provideStore({ [usersFeature.name]: usersFeature.reducer }),
    provideEffects([UsersEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
    }),

    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    })
  ]
};
