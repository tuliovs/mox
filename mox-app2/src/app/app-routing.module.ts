import { CollectionViewComponent } from './collection-hub/collection-view/collection-view.component';
import { DeckViewComponent } from './deck-hub/deck-view/deck-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MoxCardComponent } from '@shared/mox-card/mox-card.component';
import { DeckHubComponent } from './deck-hub/deck-hub.component';
import { NewDeckComponent } from './deck-hub/new-deck/new-deck.component';
import { PasswordlessAuthComponent } from './auth/passwordless-auth/passwordless-auth.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from '@karn/_services/auth.guard';
import { SearchHubComponent } from './search-hub/search-hub.component';
import { MetaGuard } from 'ng2-meta';
import { DeckListComponent } from './deck-hub/deck-list/deck-list.component';
import { CollectionHubComponent } from './collection-hub/collection-hub.component';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'card/:id', component: MoxCardComponent },
  { path: 'deckhub', component: DeckHubComponent,  canActivate: [AuthGuard] },
  { path: 'collhub', component: CollectionHubComponent,  canActivate: [AuthGuard] },
  { path: 'search', component: SearchHubComponent},
  { path: 'deck/new', component: NewDeckComponent,  canActivate: [AuthGuard] },
  { path: 'deck/list', component: DeckListComponent, canActivate: [AuthGuard] },
  { path: 'deck/:id', component: DeckViewComponent, canActivate: [MetaGuard],
    data: { meta: {
    title: 'Mox Home page',
    description: 'Mox is a portable, light, cloud and fast mtg tool.',
    'og:image': 'https://img.scryfall.com/cards/art_crop/en/vma/4.jpg?1517813031'
  } } },
  { path: 'collection/:id', component: CollectionViewComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserProfileComponent,  canActivate: [AuthGuard]},
  { path: 'nopass', component: PasswordlessAuthComponent},
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








