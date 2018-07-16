import { filter, take, tap } from 'rxjs/operators';

import { animate, keyframes, style, transition, trigger, state } from '@angular/animations';
import { AfterViewInit, Component, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: [
    trigger('avatarAnimator', [
      transition('* => rubberBand', animate(1000, keyframes(rubberBand))),
    ]),
    trigger('navTrigger', [
      state('closed', style({
        transform: 'translate3d(-100%, 0, 0)',
        display: 'none'
      })),
      state('opened', style({
        transform: 'translate3d(0, 0, 0)',
        display: 'visible'
      })),
      transition('closed=>opened', animate('300ms')),
      transition('opened=>closed', animate('300ms'))
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  private title = 'Mox';
  public sideNavIsActive = false;
  public navState = 'closed';
  public _Deck: MoxDeck;
  public animationState: string;
  public animationState2: string;
  constructor(private router: Router, private _dekService: MoxDeckService, public auth: AuthService, public msg: NotificationService) {
    router.events.subscribe((val) => {
      // console.log('mudança de rota', val instanceof NavigationEnd);
      if (val instanceof NavigationEnd) {
        this.sideNavIsActive = false;
        this.navState = 'closed';
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

  animateNav(event?) {
    this.navState = (!this.sideNavIsActive) ? 'opened' : 'closed';
    this.sideNavIsActive = !this.sideNavIsActive;
  }

  startAnimation(_state: string) {
    if (!this.animationState) {
      this.animationState = _state;
    }
  }

  menuOpen(_state: string) {
    if (!this.animationState2) {
      this.animationState2 = _state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
    this.animationState2 = '';
  }
  // startAnimate(state) {
  //   console.log(state);
  //   if (!this.animationState) {
  //     this.animationState = state;
  //   }
  // }

  reset() {
    this.navState = '';
  }

  ngAfterViewInit() {
  }
}
