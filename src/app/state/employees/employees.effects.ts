import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EmployeesActions } from './employees.actions';
import { DataService } from '../../services/data.service';
import { Store } from '@ngrx/store';
import { selectEmployees } from './employees.selectors';
import { of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, filter } from 'rxjs/operators';

@Injectable()
export class EmployeesEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private dataService = inject(DataService);

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.loadEmployees),
      withLatestFrom(this.store.select(selectEmployees)),
      filter(([_, employees]) => employees.length === 0), // skip if already loaded
      switchMap(() =>
        this.dataService.getEmployees().pipe(
          map((employees) => EmployeesActions.loadEmployeesSuccess({ employees })),
          catchError((error) => of(EmployeesActions.loadEmployeesFailure({ error })))
        )
      )
    )
  );
}
