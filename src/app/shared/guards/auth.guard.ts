import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {Observable} from 'rxjs';


@Injectable()
export class AuthGuard  {
  constructor(private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    const email = localStorage.getItem('email');
    if (!email) {
      this.router.navigate(['/auth/signin']);
      return false;
    }
    return true;
  }
}
