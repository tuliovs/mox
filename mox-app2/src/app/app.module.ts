import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
// import { firestore } from 'firebase';
import { Browser } from 'protractor';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ClarityModule } from '@clr/angular';

import { environment } from '../environments/environment';
import { MoxCardService } from './_application/_services/mox-services/card/mox-card.service';
import { MoxDeckService } from './_application/_services/mox-services/deck/mox-deck.service';
import {
    ScryfallCardService
} from './_application/_services/scryfall-services/card/scryfall-card.service';
import {
    ScryfallSearchService
} from './_application/_services/scryfall-services/search/scryfall-search.service';
import { MoxCardComponent } from './_shared/mox-card/mox-card.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { PasswordlessAuthComponent } from './auth/passwordless-auth/passwordless-auth.component';
import { DeckHubComponent } from './deck-hub/deck-hub.component';
import { NewDeckComponent } from './deck-hub/new-deck/new-deck.component';
import { HomeComponent } from './home/home.component';
import { KarnModule } from './karn/karn.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { LoadingSpinnerComponent } from './_shared/ui/loading-spinner/loading-spinner.component';
import { ReversePipe } from './_application/_pipes/reverse.pipe';
import { ToastMessageComponent } from './_shared/ui/toast-message/toast-message.component';
import { ToastService } from './_application/_services/toast/toast.service';

export const firebaseConfig = environment.firebaseConfig;

@NgModule({
  declarations: [
    AppComponent,
    MoxCardComponent,
    HomeComponent,
    NotFoundComponent,
    DeckHubComponent,
    NewDeckComponent,
    LoginComponent,
    PasswordlessAuthComponent,
    UserProfileComponent,
    LoadingSpinnerComponent,
    ReversePipe,
    ToastMessageComponent,
  ],
  imports: [
    KarnModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule ,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ClarityModule,
    BrowserAnimationsModule
  ],
  providers: [
    ToastService,
    MoxCardService,
    MoxDeckService,
    ScryfallCardService,
    ScryfallSearchService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
