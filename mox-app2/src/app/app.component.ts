import { tap, take, filter } from 'rxjs/operators';

import { AfterViewInit, Component, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { MoxDeck } from './_application/_models/_mox_models/MoxDeck';
import { MoxDeckService } from './_application/_services/mox-services/deck/mox-deck.service';
import { NotificationService } from './_application/_services/notification/notification.service';
import { AuthService } from './karn/_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, AfterViewInit {
  private title = 'Mox';
  public viewNav = false;
  public _Deck: MoxDeck;
  constructor(private router: Router, private _dekService: MoxDeckService, public auth: AuthService, public msg: NotificationService) {
    router.events.subscribe((val) => {
      // console.log('mudança de rota', val instanceof NavigationEnd);
      if (val instanceof NavigationEnd) {
        this.viewNav = false;
      }
    });
  }

  ngOnInit() {
    this._dekService.getWorkingDeck().pipe(
      tap((deck) => {
        this._Deck = <MoxDeck>deck;
        console.log(this._Deck);
        }
      )
    ).subscribe();
    this.auth.user.pipe(
      filter(user => !!user),
      take(1))
      .subscribe(user => {
          if (user) {
            this.msg.getPermission(user);
            this.msg.monitorRefresh(user);
            this.msg.receiveMessages();
          }
        }
      );
  }

  ngAfterViewInit() {
  }
}
