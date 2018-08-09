import { ActionStateService } from './_application/_services/action-state/action-state.service';
import { filter, take, tap } from 'rxjs/operators';

import { animate, keyframes, style, transition, trigger, state } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { MoxDeck } from './_application/_models/_mox_models/MoxDeck';
import { MoxDeckService } from './_application/_services/mox-services/deck/mox-deck.service';
import { NotificationService } from './_application/_services/notification/notification.service';
import { AuthService } from './karn/_services/auth.service';

export const rubberBand = [
  style({transform: 'scale3d(1, 1, 1)'}),
  style({transform: 'scale3d(1.25, 0.75, 1)'}),
  style({transform: 'scale3d(0.75, 1.25, 1)'}),
  style({transform: 'scale3d(1.15, 0.85, 1)'}),
  style({transform: 'scale3d(0.95, 1.05, 1)'}),
  style({transform: 'scale3d(1.05, 0.95, 1)'}),
  style({transform: 'scale3d(1, 1, 1)'}),
];

export const flipInY = [
  style({transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)'}),
  style({transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)'}),
  style({transform: 'perspective(400px) rotate3d(0, 1, 0, 10deg)'}),
  style({transform: 'perspective(400px) rotate3d(0, 1, 0, -5deg)'}),
  style({transform: 'perspective(400px)'}),
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: [
    trigger('actionIcoAnimator', [
      state('opened', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0
      })),
      transition('opened => closed', animate(1000, keyframes(flipInY))),
      transition('closed => opened', animate(1000, keyframes(flipInY))),
    ]),
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
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'Mox';
  public sideNavIsActive = false;
  public navState = 'closed';
  public _Deck: MoxDeck;
  public animationState: string;
  public animationState2: string;
  constructor(
    private router: Router,
    private _dekService: MoxDeckService,
    public auth: AuthService,
    public _msg: NotificationService,
    public _state: ActionStateService
  ) {
    router.events.subscribe((val) => {
      // console.log('mudança de rota', val instanceof NavigationEnd);
      if (val instanceof NavigationEnd) {
        this.title = this.routeTitler(val);
        this.sideNavIsActive = false;
        this._state.setState('nav');
        this.navState = 'closed';
      }
    });
  }

  ngOnInit() {
    this._state.getState().subscribe(stt => {
      this.animationState = stt;
    });
    this._state.setState('nav');
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
        break;
      case '/search':
          return 'Search';
        break;
      default:
          return 'Mox';
        break;
    }
  }

  isState(p): boolean {
    return (this.animationState === p);
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

  setState(newActionState) {
    this._state.setState(newActionState);
  }
  changeState(event) {
    this.animationState2 = event;
    // console.log(this.animationState2);
  }

  resetAnimationState() {
    this.animationState2 = '';
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }

  goToUser() {
    this.router.navigateByUrl('/user');
  }
  goToDeckHub() {
    this.router.navigateByUrl('/deckhub');
  }
  goToSeachHub() {
    this.router.navigateByUrl('/search');
  }

  reset() {
    this.navState = '';
  }

  ngAfterViewInit() {
  }
}
