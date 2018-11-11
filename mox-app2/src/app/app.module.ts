import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ReversePipe } from '@application/_pipes/reverse.pipe';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HammerGestureConfig, BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { environment } from '@envoirment/environment';
import { KarnModule } from '@karn/karn.module';
import { MetaModule } from 'ng2-meta';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxMdModule } from 'ngx-md';

import * as Hammer from 'hammerjs';
import { } from '@angular/platform-browser';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { MatBadgeModule, MatSelectModule, MatRippleModule, MatFormFieldModule,
        MatSlideToggleModule, MatTabsModule,
        MatInputModule, MatButtonModule, MatTooltipModule, MatProgressBarModule } from '@angular/material';


import { ActionBarComponent } from '@shared/ui/action-bar/action-bar.component';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommingWarningComponent } from '@shared/ui/comming-warning/comming-warning.component';
import { DeckHubComponent } from './deck-hub/deck-hub.component';
import { DeckViewComponent } from './deck-hub/deck-view/deck-view.component';
import { HomeComponent } from './home/home.component';
import { KarnInfoCardComponent } from '@shared/ui/karn-info-card/karn-info-card.component';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner/loading-spinner.component';
import { LoginComponent } from './auth/login/login.component';
import { MoxCardComponent } from '@shared/mox-card/mox-card.component';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { NewDeckComponent } from './deck-hub/new-deck/new-deck.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotificationService } from '@application/_services/notification/notification.service';
import { PasswordlessAuthComponent } from './auth/passwordless-auth/passwordless-auth.component';
import { RowCardComponent } from './deck-hub/deck-view/row-card/row-card.component';
import { ScryfallCardService } from '@application/_services/scryfall-services/card/scryfall-card.service';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { SearchHubComponent } from './search-hub/search-hub.component';
import { TitlebarComponent } from '@shared/ui/titlebar/titlebar.component';
import { ToastMessageComponent } from '@shared/ui/toast-message/toast-message.component';
import { ToastService } from '@application/_services/toast/toast.service';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { DotComponent } from '@shared/ui/dot/dot.component';
import { DeckStatsComponent } from './deck-hub/deck-view/deck-stats/deck-stats.component';
import { DividerComponent } from './_shared/ui/divider/divider.component';
import { FilterPickerComponent } from './_shared/ui/picker/filter-picker/filter-picker.component';
import { SortPickerComponent } from './_shared/ui/picker/sort-picker/sort-picker.component';
import { MoxFavoriteService } from '@application/_services/mox-services/favorite/mox-favorite.service';
import { FavoriteTagComponent } from './search-hub/favorite-tag/favorite-tag.component';
import { DeckListComponent } from './deck-hub/deck-list/deck-list.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PickerComponent } from './_shared/ui/picker/picker.component';
import { FolderPickerComponent } from './_shared/ui/picker/folder-picker/folder-picker.component';
import { ActionButtonComponent } from './_shared/ui/action-button/action-button.component';
import { DeckActionComponent } from './_shared/ui/picker/deck-action/deck-action.component';
import { CardActionComponent } from './_shared/ui/picker/card-action/card-action.component';
import { DeckImportComponent } from './_shared/ui/picker/deck-import/deck-import.component';
import { StatsHolderComponent } from './_shared/ui/stats-holder/stats-holder.component';
import { DeckSocialComponent } from './deck-hub/deck-view/deck-social/deck-social.component';


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
    CommingWarningComponent,
    DeckHubComponent,
    DeckViewComponent,
    HomeComponent,
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
    DeckStatsComponent,
    DividerComponent,
    FilterPickerComponent,
    SortPickerComponent,
    FavoriteTagComponent,
    DeckListComponent,
    PickerComponent,
    FolderPickerComponent,
    ActionButtonComponent,
    DeckActionComponent,
    CardActionComponent,
    DeckImportComponent,
    StatsHolderComponent,
    DeckSocialComponent,
  ],
  imports: [
    CommonModule,
    KarnModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ScrollingModule,
    Ng2GoogleChartsModule,
    MatBadgeModule,
    MatRippleModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatTabsModule,
    NgxMdModule.forRoot(),
    MetaModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireMessagingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide:  HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    ActionStateService,
    MoxCardService,
    MoxFavoriteService,
    MoxDeckService,
    NotificationService,
    ScryfallCardService,
    ScryfallSearchService,
    LocalstorageService,
    ToastService,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
