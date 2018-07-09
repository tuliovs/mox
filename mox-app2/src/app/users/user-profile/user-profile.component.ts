import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../karn/_services/auth.service';

@Component({
  selector: 'app-mox-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {
  public tab = 'profileTab';
  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
