import { ToastService } from '@application/_services/toast/toast.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, map, tap } from 'rxjs/operators';
import { logging } from 'protractor';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (private auth: AuthService, private router: Router, public toast: ToastService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.auth.user.pipe(
      take(1),
      tap((user) => {
        // this.toast.sendMessage('Acess denied!', 'danger', user.uid);
      }),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
            this.router.navigate(['/login']);
          }
        }
      )
    );
  }
}
