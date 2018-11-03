import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { filter, take, tap } from 'rxjs/operators';
import { MetaService } from 'ng2-meta';

import { animate, style, transition, trigger, state } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { NotificationService } from '@application/_services/notification/notification.service';
import { AuthService } from '@karn/_services/auth.service';
import { MoxFavoriteService } from '@application/_services/mox-services/favorite/mox-favorite.service';
import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: [
    trigger('navTrigger', [
      state('closed', style({
        transform: 'translate3d(0,100%, 0)',
        display: 'none'
      })),
      state('opened', style({
        transform: 'translate3d(0, 0, 0)',
        display: 'visible'
      })),
      transition('closed=>opened', animate('200ms')),
      transition('opened=>closed', animate('150ms'))
    ])
  ]
})
export class AppComponent implements OnInit {
  public title = 'Mox';
  public sideNavIsActive = false;
  public navState = 'closed';
  public animationState2: string;
  public navigator = navigator;
  @ViewChild(MatRipple) ripple: MatRipple;
  constructor(
    private router: Router,
    private _metaService: MetaService,
    public _auth: AuthService,
    public _favoriteService: MoxFavoriteService,
    public _localStorage: LocalstorageService,
    public _msg: NotificationService,
    public _state: ActionStateService
  ) {
    router.events.subscribe((val) => {
      // console.log('mudança de rota', val instanceof NavigationEnd);
      if (val instanceof NavigationEnd) {
        this.title = this.routeTitler(val);
        this.sideNavIsActive = false;
        this.navState = 'closed';
      }
    });
  }

  ngOnInit() {
    this._auth.getUser().pipe(
      filter(user => !!user),
      take(1))
      .subscribe(user => {
          if (user) {
            this._state.setState('nav');
            this._favoriteService._userFavorites.pipe(
              tap((favs) => {
                this._localStorage.updateFavStorage(favs);
              })
            ).subscribe();
            this._msg.getPermission(user);
            this._msg.monitorRefresh(user);
            this._msg.receiveMessages();
          }
        }
      );
  }

  routeTitler(val: NavigationEnd): string {
    switch (val.url) {
      case '/deckhub':
          return 'DeckHub';
      case '/deck/new':
          return 'New Deck';
      case '/search':
          return 'Search';
      default:
          return 'M0X';
    }
  }

  setState(newActionState) {
    this._state.setState(newActionState);
  }

  animateNav(event?) {
    this.navState = (!this.sideNavIsActive) ? 'opened' : 'closed';
    this.sideNavIsActive = !this.sideNavIsActive;
  }

  menuOpen(_state: string) {
    if (!this.animationState2) {
      this.animationState2 = _state;
    }
  }

  resetAnimationState() {
    this.animationState2 = '';
  }

  goToHome() {
    navigator.vibrate([40]);
    this.router.navigateByUrl('/home');
  }

  goToUser() {
    this.router.navigateByUrl('/user');
  }
  goToDeckHub() {
    navigator.vibrate([40]);
    this.router.navigateByUrl('/deckhub');
  }
  goToSeachHub() {
    navigator.vibrate([40]);
    this.router.navigateByUrl('/search');
  }

}
