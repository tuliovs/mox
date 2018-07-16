import { ToastService } from '@application/_services/toast/toast.service';
import { Input, Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { MoxDeck } from '@application/_models/_mox_models/MoxDeck';
import { Card } from '@application/_models/_scryfall-models/models';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-mox-card-context',
  templateUrl: './card-context.component.html',
  styleUrls: ['./card-context.component.sass'],
  animations: [
    trigger('card-contextTrigger', [
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
export class CardContextComponent implements OnInit, AfterViewInit {

  public deckCollection: AngularFirestoreCollection <MoxDeck>;
  public _Deck: MoxDeck;
  get cardCount(): number {
    const t = this._Deck.cards.filter((n) => n = this.card.id );
    return t.length;
  }
  get sideCount(): number {
    if (!this._Deck.side) {
      this._Deck.side = [];
    }
    const t = this._Deck.side.filter((n) => n = this.card.id );
    return t.length;
  }
  constructor(
    public router: Router,
    private afs: AngularFirestore,
    private _dekService: MoxDeckService,
    public toast: ToastService
  ) {}
  @Input() card;
  @Input() icon;
  public componentState = 'closed';
  public lightboxActive = false;
  ngOnInit() {}

  ngAfterViewInit() {
    this._dekService.getWorkingDeck().pipe(
      tap((deck) => {
        this._Deck = deck;
      })
    ).subscribe();
  }

  addOneCard(side?: boolean) {
    if (this._Deck) {
      if (!side) {
        this.deckCollection = this.afs.collection('decks');
        this._Deck.cards.push(this.card.id);
        this.deckCollection.doc(this._Deck.key).update({
          cards: this._Deck.cards
        });
        this.toast.sendMessage('Done! One copy of ' + this.card.name + ' included on ' + this._Deck.name, 'success', this._Deck.ownerId);
      } else {
        this.deckCollection = this.afs.collection('decks');
        if (!this._Deck.side) { this._Deck.side = []; }
        this._Deck.side.push(this.card.id);
        this.deckCollection.doc(this._Deck.key).update({
          side: this._Deck.side
        });
        this.toast.sendMessage('Done! One copy of '
                                + this.card.name
                                + ' included on '
                                + this._Deck.name
                                + ' side', 'success', this._Deck.ownerId);
      }
    }
  }

  addFourCard(side?: boolean) {
    if (this._Deck) {
      if (!side) {
        this.deckCollection = this.afs.collection('decks');
        this._Deck.cards.push(this.card.id);
        this._Deck.cards.push(this.card.id);
        this._Deck.cards.push(this.card.id);
        this._Deck.cards.push(this.card.id);
        this.deckCollection.doc(this._Deck.key).update({
          cards: this._Deck.cards
        });
        this.toast.sendMessage('Done! Four copys of ' + this.card.name + ' included on ' + this._Deck.name, 'success', this._Deck.ownerId);
      } else {
        this.deckCollection = this.afs.collection('decks');
        if (!this._Deck.side) { this._Deck.side = []; }
        this._Deck.side.push(this.card.id);
        this._Deck.side.push(this.card.id);
        this._Deck.side.push(this.card.id);
        this._Deck.side.push(this.card.id);
        this.deckCollection.doc(this._Deck.key).update({
          side: this._Deck.side
        });
        this.toast.sendMessage('Done! Four copys of '
                                + this.card.name
                                + ' included on '
                                + this._Deck.name
                                + ' side', 'success', this._Deck.ownerId);
      }
    }
  }

  setCover() {
    if (this._Deck) {
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(this._Deck.key).update({
        cover: this.card.image_uris.art_crop
      });
      this.toast.sendMessage('Congrats! ' + this.card.name + ' set as DeckCover!', 'success', this._Deck.ownerId);
    }
  }

  activateContext() {
    this.lightboxActive = true;
    this.componentState = 'opened';
  }

  closeContext() {
    this.lightboxActive = false;
    this.componentState = 'closed';
  }

  viewCard() {
    this.router.navigate(['/card/' + this.card.id]);
  }
}
