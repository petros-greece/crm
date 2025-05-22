import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SettingsComponent } from './pages/settings/settings.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { BillingComponent } from './pages/billing/billing.component';
import { AssetsComponent } from './pages/assets/assets.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { CalendarAndSchedulingComponent } from './pages/calendar-and-scheduling/calendar-and-scheduling.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { CompanyComponent } from './pages/company/company.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: 'employees', component: EmployeesComponent, title: 'Employees', data: { icon: 'manage_accounts' }, canActivate: [AuthGuard] },
  { path: 'companies', component: CompanyComponent, title: 'Companies', data: { icon: 'business' }, canActivate: [AuthGuard] },
  { path: 'departments', component: DepartmentsComponent, title: 'Departments', data: { icon: 'store' }, canActivate: [AuthGuard] },
  { path: 'tasks', component: TasksComponent, title: 'Tasks', data: { icon: 'assignment' }, canActivate: [AuthGuard] },
  { path: 'billing', component: BillingComponent, title: 'Billing', data: { icon: 'credit_card' }, canActivate: [AuthGuard] },
  { path: 'assets', component: AssetsComponent, title: 'Assets', data: { icon: 'folder' }, canActivate: [AuthGuard] },
  { path: 'calendar-and-scheduling', component: CalendarAndSchedulingComponent, title: 'Calendar', data: { icon: 'calendar_month' }, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, title: 'Settings', data: { icon: 'settings' }, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];
