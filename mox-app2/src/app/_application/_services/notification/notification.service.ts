import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { AuthService } from '@karn/_services/auth.service';
import { mergeMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();

  constructor(private afs: AngularFirestore,
    private afMessaging: AngularFireMessaging) { }

  getPermission(user) {
    // this.afMessaging.requestPermission
    // .pipe(mergeMapTo(this.afMessaging.tokenChanges))
    // .subscribe(
    //   (token) => { this.saveToken(user, token); },
    //   (error) => { console.log('Unable to get permission to notify.', error); },
    // );
  }

  monitorRefresh(user) {
    // this.afMessaging.tokenChanges
    // .subscribe(
    //   (refreshedToken) => {
    //     console.log('Token refreshed.');
    //     this.saveToken(user, refreshedToken);
    //   }
    // );
  }

  receiveMessages() {
    // this.afMessaging.messages
    //   .subscribe((message) => { this.messageSource.next(message); });
    // this.messaging.onMessage(payload => {
    //   console.log('Message received. ', payload);
    //   this.messageSource.next(payload);
    // });
  }

  private saveToken(user, token): void {
    const currentTokens = user.fcmTokens || { };
    // If token does not exist in firestore, update db
    if (!currentTokens[token]) {
      const userRef = this.afs.collection('users').doc(user.uid);
      const tokens = { ...currentTokens, [token]: true };
      userRef.update({ fcmTokens: tokens });
    }
  }
}
