import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NbThemeModule } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule, NbButtonModule, NbInputModule, } from '@nebular/theme';
import { LoginComponent } from './auth/login/login.component';
import { NotFoundComponent } from './auth/not-found/not-found.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { UserHomeComponent } from './user/user-home/user-home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    UserHomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NbThemeModule.forRoot({ name: 'mox' }),
    NbLayoutModule,
    NbButtonModule,
    NbSidebarModule.forRoot(),
    NbInputModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
