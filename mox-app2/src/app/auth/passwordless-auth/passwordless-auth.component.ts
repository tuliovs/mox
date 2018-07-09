import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mox-passwordless-auth',
  templateUrl: './passwordless-auth.component.html',
  styleUrls: ['./passwordless-auth.component.sass']
})
export class PasswordlessAuthComponent implements OnInit {
  public user: Observable<any>;
  public email: string;
  public emailSent = false;
  public url = this.router.url;
  public errorMessage: string;

  constructor(public afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    // console.log('ULR: ', this.url);
    this.user = this.afAuth.authState;
    this.confirmSingIn(this.url);
  }

  async sendEmailLink() {
    const actionCodeSettings = {
      url: environment.moxurl + 'nopass',
      handleCodeInApp: true
    };

    try {
      await this.afAuth.auth.sendSignInLinkToEmail(
        this.email,
        actionCodeSettings
      );
      window.localStorage.setItem('emailForSingIn', this.email);
      this.emailSent = true;
    } catch (err) {
      this.errorMessage = err.message;
    }
  }

  async confirmSingIn(url) {
    try {
      if ( this.afAuth.auth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSingIn');
        if (!email) {
          email = window.prompt('I`m sorry! I forggot your email, please provide your email for cornfirmation.');
        }
        const result = await this.afAuth.auth.signInWithEmailLink(email, url);
        console.log('Res: ', result);
        window.localStorage.removeItem('emailForSingIn');
      }
    } catch (err) {
      this.errorMessage = err.message;
    }
  }
}
