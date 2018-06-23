import { BrowserModule } from '@angular/platform-browser';
import { OnsenModule } from 'ngx-onsenui';
import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { MoxCardComponent } from './_shared/mox-card/mox-card.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    MoxCardComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    OnsenModule,
    AppRoutingModule
  ],
  providers: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
