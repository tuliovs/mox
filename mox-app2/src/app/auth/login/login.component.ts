import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../karn/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mox-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(
    public _auth: AuthService,
    public _state: ActionStateService,
    public _router: Router) { }

  ngOnInit() {
    this._auth.getUser().subscribe((u) => {
        if (u) {
          this._router.navigate(['/']);
        }
      }
    );
  }

}
