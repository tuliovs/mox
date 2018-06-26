import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MoxCardComponent } from './_shared/mox-card/mox-card.component';
import { DeckHubComponent } from './deck-hub/deck-hub.component';
import { NewDeckComponent } from './deck-hub/new-deck/new-deck.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'card/:id', component: MoxCardComponent },
  { path: 'deck', component: DeckHubComponent },
  { path: 'deck/new', component: NewDeckComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }








