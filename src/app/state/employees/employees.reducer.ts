// employees.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { EmployeesActions } from './employees.actions';

export interface EmployeesState {
  employees: ReadonlyArray<any>;
  loading: boolean;
  error: any;
}

export const initialState: EmployeesState = {
  employees: [],
  loading: false,
  error: null,
};

export const employeesReducer = createReducer(
  initialState,
  on(EmployeesActions.loadEmployees, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(EmployeesActions.loadEmployeesSuccess, (state, { employees }) => ({
    ...state,
    employees,
    loading: false,
  })),
  on(EmployeesActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
