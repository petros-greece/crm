import { Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { BillingComponent } from './pages/billing/billing.component';
import { AssetsComponent } from './pages/assets/assets.component';

export const routes: Routes = [
  { path: 'employees', component: EmployeesComponent, title: 'Employees', data: {icon: 'people'} }, 
  { path: 'customers', component: CustomersComponent, title: 'Customers', data: {icon: 'people'} }, 
  { path: 'billing', component: BillingComponent, title: 'Billing', data: {icon: 'credit_card'} }, 
  { path: 'assets', component: AssetsComponent, title: 'Assets', data: {icon: 'folder'} }, 
  { path: 'settings', component: SettingsComponent, title: 'Settings', data: {icon: 'settings'} }, 
];
