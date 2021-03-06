import { FORMATS } from '@application/_constraints/FORMATS';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { Card, Catalog } from '@application/_models/_scryfall-models/models';
import { ToastService } from '@application/_services/toast/toast.service';
import { Observable, of } from 'rxjs';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { tap, map } from 'rxjs/operators';
import { AuthService } from '@karn/_services/auth.service';
import { MetaService } from 'ng2-meta';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mox-deck-view',
  templateUrl: './deck-view.component.html',
  styleUrls: ['./deck-view.component.sass']
})

export class DeckViewComponent implements OnInit {
  public navigator = navigator;
  public formats = FORMATS;
  public _deck: Observable<MoxDeck>;
  public _selectedCard: Card;
  public tab = 0;
  public _orderAsc = false;
  public cardView = false;
  public side = false;
  public cardSearchActive = false;
  public searchParam;
  public searchResults: Observable<Catalog>;
  public stateCtrl = new FormControl();
  public _cardFilter;
  public _cardSort: string;
  constructor(
    public  _auth: AuthService,
    public _searchService: ScryfallSearchService,
    public _deckService: MoxDeckService,
    private _route: ActivatedRoute,
    public _router: Router,
    private _toast: ToastService,
    private _state: ActionStateService,
    private _metaService: MetaService,
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      const deckId = params['id'];
      if (!deckId) {
        this._toast.sendMessage('Not founded DeckID, maybe he got deleted?', 'danger', deckId);
        throw new Error('Not founded DeckID');
      } else {
        this._deck = this._deckService.get(deckId);
        this._deck.pipe(
          tap((dck: MoxDeck) => {
            if (dck) {
              this._metaService.setTitle('[Mox]DeckData - ' + dck.name);
              this._metaService.setTag('og:image', dck.cover);
              this._deckService.edit(dck).then(
                () => {
                  this._state.setState('nav');
                  if (this._cardSort) {
                    this.sortChoosen(this._cardSort);
                  }
                }
              );
            }
          }
        )).subscribe();
      }
    });
  }

  searchSelect(param) {
    const selectedValue = param.option.value;
    const dkSrvc = this._deckService;
    this._state.setState('loading');
    this._searchService.fuzzySearch(selectedValue).pipe(
      tap((c: Card) => {
<<<<<<< HEAD
          const dl = dkSrvc.deckProcess._deck.cards.reverse();
          dl.push(c.id);
          dl.reverse();
          dkSrvc.update(dkSrvc.deckProcess)
          .then(dp => dkSrvc.edit(dp._deck))
=======
          dkSrvc.deckProcess._deck.cards.push(c.id);
          dkSrvc.getCardData(dkSrvc.deckProcess)
          .then(dp => dkSrvc.updateDeck(dp))
>>>>>>> parent of ee554d1d... --many many collection things
          .then(() => {
              this._state.setState('nav');
            }
          );
        }
      ),
    ).subscribe();
  }

  activateSearch() {
    this.cardSearchActive = true;
    this.stateCtrl.valueChanges
      .pipe(
        tap((value: string) => {
          if (value.length >= 3) {
            this.searchResults = this._searchService.autoSearch(value);
          }
        }
      )).subscribe();
  }

  saveDeck() {
    this._deckService.update(this._deckService.deckProcess);
  }

  filteredDeckList() {
    return this._deckService.deckProcess._cardList;
  }

  navigateToNewDeck() {
    console.log('DUDE THIS WORKS');
  }

  delete() {
    if (confirm('This action can not be undone, are you sure?')) {
      this._deckService.delete(this._deckService.deckProcess._deck)
      .then(
        (res) => {
          if (res) {
            this._router.navigate(['/deckhub']);
          } else {
            alert('Error! Delete process failed.');
          }
        }
      )
      .catch(
        (err) => {
          alert(err);
        }
      );
    }
  }

  processStats() {
    this._state.setState('loading');
    this._deckService.statTools.processStats(this._deckService.deckProcess)
    .then(p1 => this._deckService.updateStats(p1))
    .then(p2 => this._deckService.update(p2))
    .then((dp) => {
      this._state.setState('nav');
      this._toast.sendMessage('Deck Fully Processed!', 'info', dp._deck.ownerId);
    })
    .catch((err) => {
      this._state.setState('error');
      console.error(err);
    });
  }

  sortChoosen(sort: string) {
    this._cardSort = sort;
    const sorter = this._deckService.sortTools;
    let paramCardList = this._deckService.deckProcess._cardList;
    switch (sort) {
      case 'alpha-up':
          paramCardList = sorter.sortAlphaUp(paramCardList);
        break;
      case 'alpha-down':
          paramCardList = sorter.sortAlphaDown(paramCardList);
        break;
      case 'cmc-up':
          paramCardList = sorter.sortCmcUp(paramCardList);
        break;
      case 'cmc-down':
          paramCardList = sorter.sortCmcDown(paramCardList);
        break;
      case 'price-up':
          paramCardList = sorter.sortPriceUp(paramCardList);
        break;
      case 'price-down':
          paramCardList = sorter.sortPriceDown(paramCardList);
        break;
      case 'type-up':
          paramCardList = sorter.sortTypeUp(paramCardList);
        break;
      case 'type-down':
          paramCardList = sorter.sortTypeDown(paramCardList);
        break;
      default:
          this._cardSort = null;
        break;
    }
  }

  cardAmount(cardId) {
    return this._deckService.statTools.countOccurrences(this._deckService.deckProcess._deck.cards, cardId);
  }

  cardSideAmount(cardId) {
    return this._deckService.statTools.countOccurrences(this._deckService.deckProcess._deck.side, cardId);
  }

  togglePublicDeck(uid) {
    navigator.vibrate([30]);
    if (uid === this._deckService.deckProcess._deck.ownerId) {
      this._deckService.deckProcess._deck.public = !this._deckService.deckProcess._deck.public;
      this.saveDeck();
    }
  }

  cardPlus(event) {
    navigator.vibrate([30]);
    this._deckService.deckProcess._deck.cards.push(event);
    this.saveDeck();
  }

  cardSidePlus(event) {
    navigator.vibrate([30]);
    this._deckService.deckProcess._deck.side.push(event);
    this.saveDeck();
  }

  cardMinus(event) {
    navigator.vibrate([30]);
    const deck = this._deckService.deckProcess._deck;
    deck.cards.splice(deck.cards.indexOf(event), 1);
    if (!deck.cards.includes(event)) {
      this._selectedCard = null;
    }
    this.saveDeck();
  }

  cardSideMinus(event) {
    const deck = this._deckService.deckProcess._deck;
    deck.side.splice(deck.side.indexOf(event), 1);
    if (!deck.side.includes(event)) {
      this._selectedCard = null;
    }
    this.saveDeck();
  }

  getCardImgUri() {
    if (this._selectedCard && this._selectedCard.image_uris) {
      return this._selectedCard.image_uris.normal;
    } else {
      return this._selectedCard.card_faces[0].image_uris.normal;
    }
  }

  getCardBackImgUri() {
    if (this._selectedCard && this._selectedCard.image_uris) {
      return './../../../assets/card_back.jpg';
    } else {
      return this._selectedCard.card_faces[1].image_uris.normal;
    }
  }

  isCardSelected(): boolean {
    return (this._selectedCard !== null);
  }

  selectedCard(card: Card) {
    if (this._selectedCard === card) {
      this._selectedCard = null;
      this.side = false;
    } else {
      navigator.vibrate([30]);
      this._selectedCard = card;
    }
  }

  activateCardView() {
    this.cardView = true;
  }

  changetab(side) {
    // this.selectedCard = null;
    // switch (side) {
    //   case 'left':
    //     // alert('LEFT');
    //     switch (this.tab) {
    //       case 'statsTab':
    //           this.tab = 'socialTab';
    //         break;
    //       case 'socialTab':
    //           this.tab = 'deckList';
    //         break;
    //       case 'deckList':
    //           this.tab = 'statsTab';
    //         break;
    //       default:
    //           alert('I`m sorry, I got lost');
    //         break;
    //     }
    //     break;
    //   case 'right':
    //     // alert('RIGHT');
    //     switch (this.tab) {
    //       case 'statsTab':
    //           this.tab = 'deckList';
    //         break;
    //       case 'deckList':
    //           this.tab = 'socialTab';
    //         break;
    //       case 'socialTab':
    //           this.tab = 'statsTab';
    //         break;
    //       default:
    //           alert('I`m sorry, I got lost');
    //         break;
    //     }
    //     break;
    //   default:
    //     break;
    // }
  }

}
