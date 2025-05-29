// employees.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataService } from '../../services/data.service';
import { EmployeesActions } from './employees.actions';
import { catchError, map, switchMap, of } from 'rxjs';

@Injectable()
export class EmployeesEffects {
  private actions$ = inject(Actions);
  private dataService = inject(DataService);

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.loadEmployees),
      switchMap(() =>
        this.dataService.getEmployees().pipe(
          map(employees => EmployeesActions.loadEmployeesSuccess({ employees })),
          catchError(error => of(EmployeesActions.loadEmployeesFailure({ error })))
        )
      )
    )
  );
}
