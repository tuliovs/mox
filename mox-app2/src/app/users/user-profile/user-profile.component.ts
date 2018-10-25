import { LocalstorageService } from './../../_application/_services/localstorage/localstorage.service';
import { tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@karn/_services/auth.service';
import { ToastService } from '@application/_services/toast/toast.service';

@Component({
  selector: 'app-mox-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {
  public tab = 'profileTab';
  public _user: any;
  constructor(
    public _auth: AuthService,
    public _storage: LocalstorageService,
    public _toast: ToastService) { }

  ngOnInit() {
    this._auth.getUser().pipe(
      tap((data) => {
        this._user = data;
      })
    ).subscribe();
  }

  clearStorage() {
    // this._storage.clear();
  }

  changetab(side) {
    switch (side) {
      case 'left':
        // alert('LEFT');
        switch (this.tab) {
          case 'statsTab':
              this.tab = 'socialTab';
            break;
          case 'socialTab':
              this.tab = 'profileTab';
            break;
          case 'profileTab':
              this.tab = 'statsTab';
            break;
          default:
              this._toast.sendMessage('I`m sorry, I got lost', 'warning', this._user.uid);
            break;
        }
        break;
      case 'right':
        // alert('RIGHT');
        switch (this.tab) {
          case 'statsTab':
              this.tab = 'profileTab';
            break;
          case 'profileTab':
              this.tab = 'socialTab';
            break;
          case 'socialTab':
              this.tab = 'statsTab';
            break;
          default:
              this._toast.sendMessage('I`m sorry, I got lost', 'warning', this._user.uid);
            break;
        }
        break;
      default:
        break;
    }
  }

}
