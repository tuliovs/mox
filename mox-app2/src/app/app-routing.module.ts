import { DeckViewComponent } from './deck-hub/deck-view/deck-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MoxCardComponent } from './_shared/mox-card/mox-card.component';
import { DeckHubComponent } from './deck-hub/deck-hub.component';
import { NewDeckComponent } from './deck-hub/new-deck/new-deck.component';
import { PasswordlessAuthComponent } from './auth/passwordless-auth/passwordless-auth.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from 'src/app/karn/_services/auth.guard';
import { SearchHubComponent } from './search-hub/search-hub.component';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'card/:id', component: MoxCardComponent },
  { path: 'deckhub', component: DeckHubComponent,  canActivate: [AuthGuard] },
  { path: 'search', component: SearchHubComponent},
  { path: 'deck/new', component: NewDeckComponent,  canActivate: [AuthGuard] },
  { path: 'deck/:id', component: DeckViewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserProfileComponent,  canActivate: [AuthGuard]},
  { path: 'nopass', component: PasswordlessAuthComponent},
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }








