import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '@application/_models/_scryfall-models/models';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-mox-favorite-tag',
  templateUrl: './favorite-tag.component.html',
  styleUrls: ['./favorite-tag.component.sass']
})
export class FavoriteTagComponent implements OnInit {
  @Input() favoriteCardId;
  @Output() tag: EventEmitter<any> = new EventEmitter();
  public _card: Card;
  constructor(
    private _cardService: MoxCardService
  ) { }

  activate() {
    navigator.vibrate([30]);
    this.tag.emit(this._card.name);
  }

  ngOnInit() {
    if (this.favoriteCardId) {
      this._cardService.getCard(this.favoriteCardId).then(
        (card) => {
          card.pipe(
            tap(c => {
              this._card = c;
            })
          ).subscribe();
        }
      );
    }
  }

}
