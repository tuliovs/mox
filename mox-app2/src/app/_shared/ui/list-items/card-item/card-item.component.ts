import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Card } from '@application/_models/_scryfall-models/models';

@Component({
  selector: 'app-mox-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.sass']
})
export class CardItemComponent implements OnInit {
  public navigator = navigator;
  public cardCollection: AngularFirestoreCollection<Card>;
  public _user: any;
  @Output() plus: EventEmitter<any> = new EventEmitter();
  @Output() minus: EventEmitter<any> = new EventEmitter();
  @Output() cardSelect: EventEmitter<any> = new EventEmitter();
  @Output() cardView: EventEmitter<any> = new EventEmitter();
  @Input() card: Card;
  @Input() cardAmout;
  @Input() selected: boolean;
  @Input() owner: boolean;
  constructor() { }

  ngOnInit() {
  }

  getName() {
    if (this.card.card_faces) {
      return this.card.card_faces[0].name;
    } else {
      return this.card.name;
    }
  }

  getCardImgUri() {
    if (this.card && this.card.image_uris) {
      return this.card.image_uris.art_crop;
    } else {
      return this.card.card_faces[0].image_uris.art_crop;
    }
  }

  getManaCosts() {
    if (this.card.card_faces) {
      return this.card.card_faces[0].mana_cost;
    } else {
      return this.card.mana_cost;
    }
  }

  getTypeLine() {
    if (this.card.card_faces) {
      return this.card.card_faces[0].type_line;
    } else {
      return this.card.type_line;
    }
  }

}
