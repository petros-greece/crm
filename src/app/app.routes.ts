import { Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { BillingComponent } from './pages/billing/billing.component';
import { AssetsComponent } from './pages/assets/assets.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { CalendarAndSchedulingComponent } from './pages/calendar-and-scheduling/calendar-and-scheduling.component';
import { DepartmentsComponent } from './pages/departments/departments.component';

export const routes: Routes = [
  { path: 'employees', component: EmployeesComponent, title: 'Employees', data: {icon: 'manage_accounts'} }, 
  { path: 'customers', component: CustomersComponent, title: 'Customers', data: {icon: 'people'} },
  { path: 'departments', component: DepartmentsComponent, title: 'Departments', data: {icon: 'store'} },     
  { path: 'tasks', component: TasksComponent, title: 'Tasks', data: {icon: 'check_circle'} },  
  { path: 'billing', component: BillingComponent, title: 'Billing', data: {icon: 'credit_card'} }, 
  { path: 'assets', component: AssetsComponent, title: 'Assets', data: {icon: 'folder'} }, 
  { path: 'calendar-and-scheduling', component: CalendarAndSchedulingComponent, title: 'Calendar', data: {icon: 'calendar_month'} },
  { path: 'settings', component: SettingsComponent, title: 'Settings', data: {icon: 'settings'} }, 
];
