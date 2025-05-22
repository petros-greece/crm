import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { OptionsService } from '../services/options.service';


export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const optionsService = inject(OptionsService);

  const user = optionsService.getOption('user');
  const userRole = optionsService.getOption('userRole');

  // If no user or role, redirect to root (login or home)
  if (!user || !userRole) {
    router.navigate(['/']);
    return false;
  }

  // The path requested
  const requestedPath = route.routeConfig?.path || '';

  // Handle special case for calendar-and-scheduling → calendar key in role
  // normalize keys like you do in your filter function:
  let key = requestedPath
    .replace('-and-scheduling', '')
    .replace(/-/g, '')
    .toLowerCase();

  // Check if userRole has 'r' permission on this key
  if (!userRole[key] || !userRole[key].includes('r')) {
    // Redirect to 404 if no permission
    router.navigate(['/not-found']);
    return false;
  }

  // Authorized
  return true;
};
