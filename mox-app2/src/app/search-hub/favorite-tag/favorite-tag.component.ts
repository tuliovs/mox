import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Card } from '@application/_models/_scryfall-models/models';
import { tap } from 'rxjs/operators';
import { MatRipple } from '@angular/material';
import { animate, keyframes, transition, trigger } from '@angular/animations';
import { tada } from '@application/_constraints/KEYFRAMES';

@Component({
  selector: 'app-mox-favorite-tag',
  templateUrl: './favorite-tag.component.html',
  styleUrls: ['./favorite-tag.component.sass'],
  animations: [
    trigger('tagAnimator', [
      transition('* => tada', animate(2000, keyframes(tada))),
    ]),
  ]
})
export class FavoriteTagComponent implements OnInit {
  @Input() favoriteCardId;
  @Output() tag: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatRipple) ripple: MatRipple;
  public navigator = navigator;
  public animationState: string;
  public _card: Card;
  constructor(
    private _cardService: MoxCardService
  ) { }

  activate() {
    navigator.vibrate([30]);
    this.tag.emit(this._card.name);
  }

  startAnimation(_state: string) {
    if (!this.animationState) {
      this.animationState = _state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  ngOnInit() {
    if (this.favoriteCardId) {
      this._cardService.getCard(this.favoriteCardId).then(
        (card) => {
          card.pipe(
            tap(c => {
              this._card = c;
              if (this.ripple) {
                this.ripple.centered = true;
                this.ripple.radius = 20;
              }
            })
          ).subscribe();
        }
      );
    }
  }

}
