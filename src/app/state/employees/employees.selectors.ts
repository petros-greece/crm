// employees.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeesState } from './employees.reducer';

export const selectEmployeesFeature = createFeatureSelector<EmployeesState>('employees');

export const selectEmployees = createSelector(
  selectEmployeesFeature,
  (state) => state.employees
);

export const selectEmployeesLoading = createSelector(
  selectEmployeesFeature,
  (state) => state.loading
);
