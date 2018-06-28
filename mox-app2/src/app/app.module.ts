import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { MoxCardComponent } from './_shared/mox-card/mox-card.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ScryfallCardService } from './_application/_services/scryfall-services/card/scryfall-card.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Browser } from 'protractor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScryfallSearchService } from './_application/_services/scryfall-services/search/scryfall-search.service';
import { DeckHubComponent } from './deck-hub/deck-hub.component';
import { NewDeckComponent } from './deck-hub/new-deck/new-deck.component';
import { firestore } from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MoxDeckService } from './_application/_services/mox-services/deck/mox-deck.service';
import { MoxCardService } from './_application/_services/mox-services/card/mox-card.service';
import { LoginComponent } from './auth/login/login.component';
import { PasswordlessAuthComponent } from './auth/passwordless-auth/passwordless-auth.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { KarnModule } from './karn/karn.module';
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
  ],
  imports: [
    KarnModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig, 'mox-mtg'),
    // AngularFirestoreModule.enablePersistence(),
    // AngularFireAuthModule,
    AngularFireStorageModule ,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ClarityModule,
    BrowserAnimationsModule
  ],
  providers: [
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
