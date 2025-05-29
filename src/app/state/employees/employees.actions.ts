// employees.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const EmployeesActions = createActionGroup({
  source: 'Employees',
  events: {
    'Load Employees': emptyProps(), // Define an action with no payload
    'Load Employees Success': props<{ employees: any[] }>(),
    'Load Employees Failure': props<{ error: any }>(),
  }
});
