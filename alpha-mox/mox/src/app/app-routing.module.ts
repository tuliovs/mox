import { UserHomeComponent } from './user/user-home/user-home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NotFoundComponent } from './auth/not-found/not-found.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  { path: '', component: UserHomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
