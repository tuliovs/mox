import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxFavoriteService } from '@application/_services/mox-services/favorite/mox-favorite.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';
import { AuthService } from '@karn/_services/auth.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { Card } from '@application/_models/_scryfall-models/models';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';

@Component({
  selector: 'app-mox-card-action',
  templateUrl: './card-action.component.html',
  styleUrls: ['./card-action.component.sass']
})
export class CardActionComponent implements OnInit {
  public deckCollection: AngularFirestoreCollection <MoxDeck>;
  public _Deck: MoxDeck;
  get cardCount(): number {
    const t = this._deckService.deckProcess._deck.cards.filter((n) => n = this.card.id );
    return t.length;
  }
  get sideCount(): number {
    if (!this._deckService.deckProcess._deck.side) {
      this._deckService.deckProcess._deck.side = [];
    }
    const t = this._deckService.deckProcess._deck.side.filter((n) => n = this.card.id );
    return t.length;
  }
  @Input() card;
  @Output() cardActionChoosen: EventEmitter<string> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  constructor(
    public _favService: MoxFavoriteService,
    public _router: Router,
    public afs: AngularFirestore,
    public _localstorageService: LocalstorageService,
    public _auth: AuthService,
    public _deckService: MoxDeckService,
    public _state: ActionStateService,
    public _toast: ToastService
  ) { }

  ngOnInit() {
  }
  getCardImgUriCrop() {
    if (this.card && this.card.image_uris) {
      return this.card.image_uris.art_crop;
    } else {
      return this.card.card_faces[0].image_uris.art_crop;
    }
  }

  addOneCard(side?: boolean) {
    if (!side) {
      this._deckService.addCard(this.card.id);
    } else {
      this._deckService.addCardSide(this.card.id);
    }
    navigator.vibrate([30]);
    this.closeContext();
  }

  favoriteCard(card: Card) {
    navigator.vibrate([30]);
    this._favService.favoriteCard(card).then(
      () => {
        // console.log('!SUCESS!');
      }
    ).catch((err) => {
      console.error(err);
    });
  }

  isFavorite() {
    return this._favService.isFav(this.card.id);
  }

  setCover() {
    if (this._deckService.deckProcess._deck) {
      navigator.vibrate([30]);
      this._deckService.deckProcess.active = true;
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(this._deckService.deckProcess._deck.key).update({
        cover: this.getCardImgUriCrop()
      }).then(
        () => {
          this._toast.sendMessage(
            'Congrats! ' + this.card.name + ' set as DeckCover for ' + this._deckService.deckProcess._deck.name + ' !',
            'success',
            this._deckService.deckProcess._deck.ownerId);
          this._deckService.deckProcess.active = false;
          this.closeContext();
          this._state.returnState();
        }
      );
    }
    this.closeContext();
  }

  viewCard() {
    this._router.navigate(['/card/' + this.card.id]);
  }

  closeContext() {
    this.cancel.emit();
    this._state.returnState();
  }
}
