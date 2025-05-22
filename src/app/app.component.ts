import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { OptionsService } from './services/options.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  theme:string = '';

  routes:Routes = [];
  constructor(private router: Router, private optionsService: OptionsService) {
    
    this.routes = this.filterRoutesByRole({
      "roleName": "Super Admin",
      "employees": ["r", "c", "u", "d"],
      "companies": ["r", "c", "u", "d"],
      "departments": ["r", "c", "u", "d"],
      "tasks": ["r", "c", "u", "d"],
      "billing": ["r", "c", "u", "d"],
      "assets": ["r", "c", "u", "d"],
      "calendar": ["r", "c", "u", "d"],
      "settings": ["r", "c", "u", "d"],
      "id": "1"
    }, routes);

    this.theme = this.optionsService.getOption('theme');

    // localStorage.setItem('user', JSON.stringify({
    //   "id": "2",
    //   "fullName": "Bob Smith",
    //   "email": "bob.smith@company.com",
    //   "phoneNumber": "+15555550124",
    //   "birthDate": "1992-11-02",
    //   "address": "456 Oak Avenue",
    //   "city": "Gotham",
    //   "zipCode": "54321",
    //   "hireDate": "2018-07-01",
    //   "role": "Software Engineer",
    //   "department": "Engineering",
    //   "isActive": true,
    //   "tasks": [],
    //   "crmRole": "Super Admin"
    // }));

    // localStorage.setItem('userRole', JSON.stringify({
    //   "roleName": "Super Admin",
    //   "employees": ["r", "c", "u", "d"],
    //   "companies": ["r", "c", "u", "d"],
    //   "departments": ["r", "c", "u", "d"],
    //   "tasks": ["r", "c", "u", "d"],
    //   "billing": ["r", "c", "u", "d"],
    //   "assets": ["r", "c", "u", "d"],
    //   "calendar": ["r", "c", "u", "d"],
    //   "settings": ["r", "c", "u", "d"],
    //   "id": "1"
    // }));




  }

  toggleTheme(){
    this.theme = this.theme === 'dark' ? '' : 'dark';
    this.optionsService.updateOption('theme', this.theme);
  }

  filterRoutesByRole(role: any, routes: Routes): Routes {
    return routes.filter(route => {
      if (!route.path) {
        return false;
      }
      const key = route.path
        .replace('-and-scheduling', '') // special case
        .replace(/-/g, '')              // remove dashes for keys like "calendar-and-scheduling"
        .toLowerCase();

      return role[key] && role[key].includes('r');
    });
  }
  
}