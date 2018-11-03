import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { animate, keyframes, style, transition, trigger, state } from '@angular/animations';
import { flipInY } from '@application/_constraints/KEYFRAMES';
import { MatRipple } from '@angular/material';
import { AuthService } from '@karn/_services/auth.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';

@Component({
  selector: 'app-mox-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.sass'],
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
    ])
  ]
})
export class ActionButtonComponent implements OnInit {
  public animationState: string;
  public animationState2: string;
  public navigator = navigator;
  @ViewChild(MatRipple) ripple: MatRipple;
  @Output() activateMenuOpen: EventEmitter<any> = new EventEmitter();
  constructor(
    public _auth: AuthService,
    private _dekService: MoxDeckService,
    public _state: ActionStateService,
  ) { }

  ngOnInit() {
    this._state.getState().subscribe(stt => {
      this.animationState = stt;
      if (this.ripple) {
        this.ripple.centered = true;
        this.ripple.radius = 20;
      }
    });
  }

  setState(newActionState) {
    this._state.setState(newActionState);
  }

  changeState(event) {
    this.animationState2 = event;
    // console.log(this.animationState2);
  }

  abortState() {
    this._state.setState('nav');
    navigator.vibrate([30, 30]);
  }

  view() {
    this._dekService.viewDeck();
  }

  isState(p): boolean {
    return (this.animationState === p);
  }

  resetAnimationState() {
    this.animationState2 = '';
  }
}
