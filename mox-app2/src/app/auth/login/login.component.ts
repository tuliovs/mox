import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../karn/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mox-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService, public router: Router) { }

  ngOnInit() {
    this.auth.user.subscribe((u) => {
        if (u) {
          this.router.navigate(['/']);
        }
      }
    );
  }

}
