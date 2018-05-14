import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }    from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { MaterialModule } from './app.material.module';

import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    MaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing
  ],
  exports: [
    MaterialModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
