import { Card } from '@application/_models/_scryfall-models/models';
import { ToastService } from '@application/_services/toast/toast.service';
import { Observable } from 'rxjs';
import { MoxDeck } from '@application/_models/_mox_models/MoxDeck';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { tap } from '../../../../node_modules/rxjs/operators';

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
  public tab = 'profileTab';
  public _orderAsc = false;
  public cardView = false;
  public deckCollection: AngularFirestoreCollection<MoxDeck>;
  public deckStatsCollection: AngularFirestoreCollection<any>;
  public cardCollection: AngularFirestoreCollection<Card>;
  public cardDoc: AngularFirestoreDocument<Card>;
  constructor(
    private _deckService: MoxDeckService,
    private _route: ActivatedRoute,
    private _toast: ToastService,
    private router: Router,
    private _state: ActionStateService
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      const deckId = params['id'];
      if (!deckId) {
        this._toast.sendMessage('Not founded DeckID, maybe he got deleted?', 'danger', deckId);
        throw new Error('Not founded DeckID');
      } else {
        this._deck = this._deckService.getDeck(deckId);
        this._deck.pipe(
          tap((dck) => {
            this._deckService.editDeck(dck);
          }
        )).subscribe();
      }
    });
  }

  saveDeck() {
    this._deckService.updateDeck();
  }

  cardSort(order) {
    this._orderAsc = this._deckService.cardSort(order);
  }

  cardAmount(cardId) {
    return this._deckService.countOccurrences(this._deckService.deckProcess._deck.cards, cardId);
  }

  cardSideAmount(cardId) {
    return this._deckService.countOccurrences(this._deckService.deckProcess._deck.side, cardId);
  }

  cardPlus(event) {
    this._deckService.deckProcess._deck.cards.push(event);
    this.saveDeck();
  }
  cardSidePlus(event) {
    this._deckService.deckProcess._deck.side.push(event);
    this.saveDeck();
  }
  cardMinus(event) {
    this._deckService.deckProcess._deck.cards
      .splice(this._deckService.deckProcess._deck.cards.indexOf(event), 1);
    this.saveDeck();
  }
  cardSideMinus(event) {
    this._deckService.deckProcess._deck.side
      .splice(this._deckService.deckProcess._deck.side.indexOf(event), 1);
    this.saveDeck();
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
