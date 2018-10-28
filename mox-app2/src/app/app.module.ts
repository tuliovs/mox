import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ReversePipe } from '@application/_pipes/reverse.pipe';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HammerGestureConfig, BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { environment } from '@envoirment/environment';
import { KarnModule } from '@karn/karn.module';
import { MetaModule } from 'ng2-meta';

import * as Hammer from 'hammerjs';
import { } from '@angular/platform-browser';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { MarkdownModule, MarkdownService, MarkedRenderer, MarkedOptions } from 'ngx-markdown';

import { MatBadgeModule, MatSelectModule, MatRippleModule,
        MatInputModule, MatButtonModule, MatTooltipModule } from '@angular/material';

import { ActionBarComponent } from '@shared/ui/action-bar/action-bar.component';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CardContextComponent } from '@shared/ui/context-menu/card-context/card-context.component';
import { CommingWarningComponent } from '@shared/ui/comming-warning/comming-warning.component';
import { DeckHubComponent } from './deck-hub/deck-hub.component';
import { DeckViewComponent } from './deck-hub/deck-view/deck-view.component';
import { HomeComponent } from './home/home.component';
import { ImportDeckContextComponent } from '@shared/ui/context-menu/import-deck-context/import-deck-context.component';
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
import { DeckContextComponent } from '@shared/ui/context-menu/deck-context/deck-context.component';
import { DividerComponent } from './_shared/ui/divider/divider.component';
import { FilterPickerComponent } from './_shared/ui/picker/filter-picker/filter-picker.component';
import { SortPickerComponent } from './_shared/ui/picker/sort-picker/sort-picker.component';
import { MoxFavoriteService } from '@application/_services/mox-services/favorite/mox-favorite.service';
import { FavoriteTagComponent } from './search-hub/favorite-tag/favorite-tag.component';
import { DeckListComponent } from './deck-hub/deck-list/deck-list.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PickerComponent } from './_shared/ui/picker/picker.component';
import { FolderPickerComponent } from './_shared/ui/picker/folder-picker/folder-picker.component';


export const firebaseConfig = environment.firebaseConfig;

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      // override hammerjs default configuration
      'swipe': { direction: Hammer.DIRECTION_ALL  }
  };
}

export function markedOptions(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.blockquote = (text: string) => {
    return '<blockquote class="blockquote"><p>' + text + '</p></blockquote>';
  };

  return {
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
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
    DeckStatsComponent,
    DeckContextComponent,
    DividerComponent,
    FilterPickerComponent,
    SortPickerComponent,
    FavoriteTagComponent,
    DeckListComponent,
    PickerComponent,
    FolderPickerComponent,
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
    ScrollingModule,
    MatBadgeModule,
    MatRippleModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptions,
      },
    }),
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
    MarkdownService,
    ToastService,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
