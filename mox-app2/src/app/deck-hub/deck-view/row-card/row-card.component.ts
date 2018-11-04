import { Card } from '@application/_models/_scryfall-models/models';
import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { tap } from 'rxjs/operators';
import { ToastService } from '@application/_services/toast/toast.service';
import { AuthService } from '@karn/_services/auth.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { MatRipple } from '@angular/material';

@Component({
  selector: 'app-mox-row-card',
  templateUrl: './row-card.component.html',
  styleUrls: ['./row-card.component.sass']
})
export class RowCardComponent implements OnInit, AfterViewInit {
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
  @Input() deckFormat: string;
  @ViewChild(MatRipple) ripple: MatRipple;
  constructor(
    public _auth: AuthService,
    public _deckService: MoxDeckService,
    public _cardService: MoxCardService,
    public _toast: ToastService,
  ) { }

  ngOnInit() {
    // console.log(this.card);
    this._auth.getUser().pipe(
      tap((user) => {
        this._user = user;
        if (this.ripple) {
          this.ripple.centered = true;
        }
      })
    ).subscribe();
  }

  isFormatLegal(): boolean {
    // console.log(this.card.legalities[this.deckFormat]);
    return ( this.card.legalities
          && this.card.legalities[this.deckFormat]
          && this.card.legalities[this.deckFormat].toString().trim().toLowerCase() === 'not_legal');
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

  ngAfterViewInit() {
  }
}
