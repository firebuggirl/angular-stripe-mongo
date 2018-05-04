import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('token')) {//ckeck if user is logged in
      return state.url.startsWith('/profile')
        ? true
        : (this.router.navigate(['/']), false);
    } else {
      return state.url.startsWith('/profile')
        ? (this.router.navigate(['/']), false)
        : true;
    }
  }
}
