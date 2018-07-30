import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ReversePipe } from './_application/_pipes/reverse.pipe';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HammerGestureConfig, BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { KarnModule } from './karn/karn.module';
import * as Hammer from 'hammerjs';
import { } from '@angular/platform-browser';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { ActionBarComponent } from './_shared/ui/action-bar/action-bar.component';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CardContextComponent } from './_shared/ui/context-menu/card-context/card-context.component';
import { CommingWarningComponent } from './_shared/ui/comming-warning/comming-warning.component';
import { DeckHubComponent } from './deck-hub/deck-hub.component';
import { DeckViewComponent } from './deck-hub/deck-view/deck-view.component';
import { HomeComponent } from './home/home.component';
import { ImportDeckContextComponent } from './_shared/ui/context-menu/import-deck-context/import-deck-context.component';
import { KarnInfoCardComponent } from './_shared/ui/karn-info-card/karn-info-card.component';
import { LoadingSpinnerComponent } from './_shared/ui/loading-spinner/loading-spinner.component';
import { LoginComponent } from './auth/login/login.component';
import { MoxCardComponent } from './_shared/mox-card/mox-card.component';
import { MoxCardService } from './_application/_services/mox-services/card/mox-card.service';
import { MoxDeckService } from './_application/_services/mox-services/deck/mox-deck.service';
import { NewDeckComponent } from './deck-hub/new-deck/new-deck.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotificationService } from './_application/_services/notification/notification.service';
import { PasswordlessAuthComponent } from './auth/passwordless-auth/passwordless-auth.component';
import { RowCardComponent } from './deck-hub/deck-view/row-card/row-card.component';
import { ScryfallCardService } from './_application/_services/scryfall-services/card/scryfall-card.service';
import { ScryfallSearchService } from './_application/_services/scryfall-services/search/scryfall-search.service';
import { SearchHubComponent } from './search-hub/search-hub.component';
import { TitlebarComponent } from './_shared/ui/titlebar/titlebar.component';
import { ToastMessageComponent } from './_shared/ui/toast-message/toast-message.component';
import { ToastService } from './_application/_services/toast/toast.service';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { DotComponent } from './_shared/ui/dot/dot.component';

export const firebaseConfig = environment.firebaseConfig;

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      // override hammerjs default configuration
      'swipe': { direction: Hammer.DIRECTION_ALL  }
  };
}

@NgModule({
  declarations: [
    ActionBarComponent,
    AppComponent,
    CardContextComponent,
    CommingWarningComponent,
    DeckHubComponent,
    DeckViewComponent,
    HomeComponent,
    ImportDeckContextComponent,
    KarnInfoCardComponent,
    LoadingSpinnerComponent,
    LoginComponent,
    MoxCardComponent,
    NewDeckComponent,
    NotFoundComponent,
    PasswordlessAuthComponent,
    ReversePipe,
    RowCardComponent,
    SearchHubComponent,
    TitlebarComponent,
    ToastMessageComponent,
    UserProfileComponent,
    DotComponent,
  ],
  imports: [
    CommonModule,
    KarnModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide:  HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    ActionStateService,
    MoxCardService,
    MoxDeckService,
    NotificationService,
    ScryfallCardService,
    ScryfallSearchService,
    ToastService,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
