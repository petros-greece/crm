import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { employeesReducer } from './state/employees/employees.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { EmployeesEffects } from './state/employees/employees.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
        employees: employeesReducer
    }),
    provideStoreDevtools({
        maxAge: 25,
        logOnly: true,
    }),
    provideEffects([EmployeesEffects]),
]
};
