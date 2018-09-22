import { Card } from '@application/_models/_scryfall-models/models';
import { ToastService } from '@application/_services/toast/toast.service';
import { Observable } from 'rxjs';
import { MoxDeck } from '@application/_models/_mox_models/MoxDeck';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';

@Component({
  selector: 'app-mox-deck-view',
  templateUrl: './deck-view.component.html',
  styleUrls: ['./deck-view.component.sass']
})

export class DeckViewComponent implements OnInit {
  public formats = [
    '1v1',
    'brawl',
    'commander',
    'duek',
    'frontier',
    'future',
    'legacy',
    'modern',
    'pauper',
    'penny',
    'standard',
    'vintage'
  ];

  public _deck: Observable<MoxDeck>;
  public _selectedCard;
  public tempDeck: MoxDeck;
  public tab = 'profileTab';
  public _orderAsc = false;
  public _id: string;
  public cardView = false;
  public deckCollection: AngularFirestoreCollection<MoxDeck>;
  public deckStatsCollection: AngularFirestoreCollection<any>;
  public cardCollection: AngularFirestoreCollection<Card>;
  public cardDoc: AngularFirestoreDocument<Card>;
  constructor(
    private afs: AngularFirestore,
    public _cardService: MoxCardService,
    private _deckService: MoxDeckService,
    private _route: ActivatedRoute,
    private _toast: ToastService,
    private router: Router,
    private _state: ActionStateService
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      const id = params['id'];
      if (!id) {
        this._toast.sendMessage('Not founded DeckID, maybe he got deleted?', 'danger', id);
        throw new Error('Not founded DeckID');
      } else {
        this._id = id;
        this.deckCollection = this.afs.collection('decks');
        this.deckStatsCollection = this.afs.collection('deck-stats');
        this._deck = this.deckCollection.doc<MoxDeck>(id).valueChanges();
        this._deck.pipe(
          tap((deck) => {
            if (deck) {
              if (!deck.side) { deck.side = [];  }
              this.tempDeck = deck;
              this._deckService.editDeck(deck);
              this._deckService.deckProcess._cardList = [];
              this._deckService.deckProcess._sideList = [];
              this._deckService.deckProcess._deckStats = null;
              this.deckStatsCollection.doc(deck.key).valueChanges()
              .pipe(
                tap((deckStats) => {
                  this._deckService.deckProcess._deckStats = deckStats;
                })
              ).subscribe();
              Array.from(new Set(deck.cards))
              .forEach((incard) => {
                this._cardService.getCard(incard).pipe(
                  tap((x: Card) => {
                    this._state.setState('loading');
                    this._deckService.deckProcess._cardList.push(x);
                    if (Array.from(new Set(deck.cards)).length === this._deckService.deckProcess._cardList.length) {
                      this.cardSort(false);
                      this._state.setState('nav');
                      // console.log('Sort');
                    }
                  }),
                ).subscribe();
              });
              Array.from(new Set(deck.side))
              .forEach((incard) => {
                this._cardService.getCard(incard).pipe(
                  tap((x: Card) => {
                    this._state.setState('loading');
                    this._deckService.deckProcess._sideList.push(x);
                    if (Array.from(new Set(deck.side)).length === this._deckService.deckProcess._sideList.length) {
                      this.cardSort(false);
                      this._state.setState('nav');
                      // console.log('Sort');
                    }
                  })
                ).subscribe();
              });
            }
          }),
        ).subscribe();
      }
    });
  }

  saveDeck(silent?: boolean) {
    this._state.setState('cloud');
    this.deckCollection = this.afs.collection('decks');
    this.deckCollection.doc<MoxDeck>(this._id).update(this.tempDeck).then(
      () => {
        this._state.setState('nav');
      }
    );
  }

  cardSort(order) {
    this._deckService.deckProcess._cardList = this._deckService.deckProcess._cardList.sort((a: Card, b: Card): number => {
      if (order) {
        if ( a.cmc < b.cmc ) { return -1; }
        if ( a.cmc > b.cmc ) { return 1; }
        return 0;
      } else {
        if ( a.cmc > b.cmc ) { return -1; }
        if ( a.cmc < b.cmc ) { return 1; }
        return 0;
      }
    });
    this._deckService.deckProcess._sideList = this._deckService.deckProcess._sideList.sort((a: Card, b: Card): number => {
      if (order) {
        if ( a.cmc < b.cmc ) { return -1; }
        if ( a.cmc > b.cmc ) { return 1; }
        return 0;
      } else {
        if ( a.cmc > b.cmc ) { return -1; }
        if ( a.cmc < b.cmc ) { return 1; }
        return 0;
      }
    });
    this._orderAsc = order;
  }

  cardAmount(cardId) {
    return this._deckService.countOccurrences(this.tempDeck.cards, cardId);
  }

  cardSideAmount(cardId) {
    return this._deckService.countOccurrences(this.tempDeck.side, cardId);
  }

  cardPlus(event) {
    this.tempDeck.cards.push(event);
    this.saveDeck(true);
  }
  cardSidePlus(event) {
    this.tempDeck.side.push(event);
    this.saveDeck(true);
  }
  cardMinus(event) {
    this.tempDeck.cards.splice(this.tempDeck.cards.indexOf(event), 1);
    this.saveDeck(true);
  }
  cardSideMinus(event) {
    this.tempDeck.side.splice(this.tempDeck.side.indexOf(event), 1);
    this.saveDeck(true);
  }

  selectedCard(card: Card) {
    if (this._selectedCard === card) {
      this._selectedCard = null;
    } else {
      // this._moxService.editDeck(deck);
      this._selectedCard = card;
    }
  }

  activateCardView(v) {
    this.cardView = v;
  }

  changetab(side) {
    switch (side) {
      case 'left':
        // alert('LEFT');
        switch (this.tab) {
          case 'statsTab':
              this.tab = 'socialTab';
            break;
          case 'socialTab':
              this.tab = 'profileTab';
            break;
          case 'profileTab':
              this.tab = 'statsTab';
            break;
          default:
              alert('I`m sorry, I got lost');
            break;
        }
        break;
      case 'right':
        // alert('RIGHT');
        switch (this.tab) {
          case 'statsTab':
              this.tab = 'profileTab';
            break;
          case 'profileTab':
              this.tab = 'socialTab';
            break;
          case 'socialTab':
              this.tab = 'statsTab';
            break;
          default:
              alert('I`m sorry, I got lost');
            break;
        }
        break;
      default:
        break;
    }
  }

}
