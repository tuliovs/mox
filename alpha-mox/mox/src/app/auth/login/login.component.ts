
// import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from '@envoirment/environment';
import { Observable } from 'rxjs';
import { faGooglePlusG, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mox-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, AfterViewInit {
  constructor(
    public _AUTH: AuthService,
    public afAuth: AngularFireAuth,
    // public _state: ActionStateService,
    public _ROUTER: Router) { }

  public user: Observable<any>;
  public faGooglePlusG = faGooglePlusG;
  public faGithub = faGithub;
  public faTwitter = faTwitter;
  public faEnvelopeOpen = faEnvelopeOpen;
  public formActive = false;
  public email: string;
  public emailSent = false;
  public url = this._ROUTER.url;
  public errorMessage: string;
  ngOnInit() {
    this.user = this.afAuth.authState;
    this.confirmSingIn(this.url);
  }

  ngAfterViewInit(): void {
    // this._state.setState('hidden');
    this._AUTH.getUser().subscribe((u) => {
        if (u) {
          this._ROUTER.navigate(['/']);
        }
      }
    );
  }

  async sendEmailLink() {
    const actionCodeSettings = {
      url: environment.moxurl + 'login',
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

  async confirmSingIn(url: string) {
    try {
      if ( this.afAuth.auth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSingIn');
        if (!email) {
          email = window.prompt('I`m sorry! I forggot your email, please provide your email for cornfirmation.');
        }
        const result = await this.afAuth.auth.signInWithEmailLink(email, url);
        // console.log('Res: ', result);
        window.localStorage.removeItem('emailForSingIn');
      }
    } catch (err) {
      this.errorMessage = err.message;
    }
  }
}
