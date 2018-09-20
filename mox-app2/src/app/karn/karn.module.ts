import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence()

  ],
  declarations: []
})
export class KarnModule { }
