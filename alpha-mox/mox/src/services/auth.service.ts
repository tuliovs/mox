import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
              this.updateUserData(credetial.user);
            } else {
              this.setUserData(credetial.user);
            }
          }
        );
      }
    );
  }

  googleLogin() {
    return this.oAuthLogin(new auth.GoogleAuthProvider());
  }

  twitterLogin() {
    return this.oAuthLogin(new auth.TwitterAuthProvider());
  }

  gitHubLogin() {
    return this.oAuthLogin(new auth.GithubAuthProvider());
  }

  updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      // nickName: user.nickName,
      photoURL: user.photoURL,
    };
    return userRef.update(data);
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
