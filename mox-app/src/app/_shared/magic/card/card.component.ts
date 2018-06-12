import { Component, OnInit, Input } from '@angular/core';
import { MagicardService } from '../../../_mox/services';
import { Card } from '../../../_scryfall/models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass']
})

export class CardComponent implements OnInit {
  @Input() cardId;
  private cardData: Card;
  constructor(private _mcard: MagicardService ) { }

  ngOnInit() {
    this.getData();
  }


  getData() {
    this._mcard.getMagicCard(this.cardId).subscribe(
      data => { this.cardData = data; },
      err => console.error(err),
      () => console.warn('done load card')
    );
  }
}
