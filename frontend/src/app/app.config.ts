import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { usersReducer } from './store/users/users.reducer';
import { UsersEffects } from './store/users/users.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideStore({ users: usersReducer }),
    provideEffects([UsersEffects]),
    provideStoreDevtools({
      maxAge: 25, 
      logOnly: false, 
      autoPause: true, 
    })
  ]
};