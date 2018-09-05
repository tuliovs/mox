import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  nickName?: string;
  fcmTokens?: { [token: string]: true };
}


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private user =  new Observable<User>();

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user = this.afAuth.authState.pipe(switchMap( user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }));
  }

  public getUser(): Observable<User> {
    return this.user;
  }

  oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(
      (credetial) => {
        this.afs.collection('users').doc(credetial.user.uid).snapshotChanges().subscribe(
          (doc) => {
            if  (doc.payload.exists) {
              // this.updateUserData(credetial.user);
            } else {
              this.setUserData(credetial.user);
            }
          }
        );
      }
    );
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  gitHubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      nickName: user.nickName,
      photoURL: user.photoURL,
    };
    return userRef.update(user);
  }

  setUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    return userRef.set(data);
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
