import { CanActivateFn } from '@angular/router';



export const AuthGuard: CanActivateFn = (route, state) => {
  console.log(route, state)
  return true;
};
