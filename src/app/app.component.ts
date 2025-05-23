import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, Routes, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { OptionsService } from './services/options.service';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';

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
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  theme = '';
  routes: Routes = [];
  user: any;
  hasRedirected = false;

  constructor(private router: Router, private optionsService: OptionsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initializeUserAndRoutes();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.initializeUserAndRoutes();

      // if (event.urlAfterRedirects === '/') {
      //   this.hasRedirected = false;
      // }
      // // Redirect to first available route if any
      if (!this.hasRedirected && environment.production) {
        this.router.navigate([this.routes[0].path]);
        this.hasRedirected = true;
      }

    });
  }

  private initializeUserAndRoutes() {
    this.theme = this.optionsService.getOption('theme');
    this.user = this.optionsService.getOption('user');
    const role = this.optionsService.getOption('userRole');
    this.routes = this.filterRoutesByRole(role, routes);
    this.cdr.detectChanges();
  }

  filterRoutesByRole(role: any, routes: Routes): Routes {
    return routes.filter(route => {
      if (!route.path) {
        return false;
      }
      const key = route.path
        .replace('-and-scheduling', '')
        .replace(/-/g, '')
        .toLowerCase();

      return role?.[key] && role[key].includes('r');
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? '' : 'dark';
    this.optionsService.updateOption('theme', this.theme);
  }

  logout() {
    this.user = null;
    this.optionsService.deleteOption('user');
    this.optionsService.deleteOption('userRole');
    this.router.navigate(['/']);
  }
}