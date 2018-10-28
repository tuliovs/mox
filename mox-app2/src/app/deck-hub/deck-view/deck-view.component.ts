import { Card } from '@application/_models/_scryfall-models/models';
import { ToastService } from '@application/_services/toast/toast.service';
import { Observable } from 'rxjs';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { tap } from 'rxjs/operators';
import { AuthService } from '@karn/_services/auth.service';
import { MetaService } from 'ng2-meta';
import { ActionBarConfig, ActionButton } from '@application/_models/_mox-models/Config';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-mox-deck-view',
  templateUrl: './deck-view.component.html',
  styleUrls: ['./deck-view.component.sass']
})

export class DeckViewComponent implements OnInit {
  public navigator = navigator;
  public _deck: Observable<MoxDeck>;
  public _selectedCard: Card;
  public tab = 'deckList';
  public _orderAsc = false;
  public cardView = false;
  public side = false;
  public _cardFilter;
  public _cardSort;
  public actionConfigSocial = new ActionBarConfig();
  public actionConfigStats = new ActionBarConfig();
  constructor(
    public  _auth: AuthService,
    public _deckService: MoxDeckService,
    private _route: ActivatedRoute,
    private _toast: ToastService,
    private _metaService: MetaService,
    public _mdService: MarkdownService
  ) {
      this.actionConfigSocial.actions = new Array<ActionButton>();
      this.actionConfigStats.actions = new Array<ActionButton>();
      // actionSettings
      let act;
      // social
      act = this.actionConfigSocial.actions;
        act[0] = Object.assign({icon: '', disabled: true, action: this.navigateToNewDeck.bind(this) });
        act[1] = Object.assign({icon: '', disabled: true, action: this.navigateToNewDeck.bind(this) });
        act[2] = Object.assign({icon: '', disabled: true, action: this.navigateToNewDeck.bind(this) });
        act[3] = Object.assign({icon: '', disabled: true, action: this.navigateToNewDeck.bind(this) });
      // stats
      act = this.actionConfigStats.actions;
        act[0] = Object.assign({icon: '', disabled: true, action: this.navigateToNewDeck.bind(this) });
        act[1] = Object.assign({icon: '', disabled: true, action: this.navigateToNewDeck.bind(this) });
        act[2] = Object.assign({icon: '', disabled: true, action: this.navigateToNewDeck.bind(this) });
        act[3] = Object.assign({icon: '', disabled: true, action: this.navigateToNewDeck.bind(this) });
  }

  ngOnInit() {
    this.initMarkdown();
    this._route.params.subscribe(params => {
      const deckId = params['id'];
      if (!deckId) {
        this._toast.sendMessage('Not founded DeckID, maybe he got deleted?', 'danger', deckId);
        throw new Error('Not founded DeckID');
      } else {
        this._deck = this._deckService.getDeck(deckId);
        this._deck.pipe(
          tap((dck) => {
            this._metaService.setTitle('[Mox]DeckData - ' + dck.name);
            this._metaService.setTag('og:image', dck.cover);
            this._deckService.editDeck(dck);
            if (this._cardSort) {
              this.sortChoosen(this._cardSort);
            }
          }
        )).subscribe();
      }
    });
  }

  private initMarkdown() {
    this._mdService.renderer.heading = (text: string, level: number) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return '<h' + level + '>' +
              '<a name="' + escapedText + '" class="anchor" href="#' + escapedText + '">' +
                '<span class="header-link"></span>' +
              '</a>' + text +
            '</h' + level + '>';
    };
  }

  saveDeck() {
    this._deckService.updateDeck();
  }

  filteredDeckList() {
    // tslint:disable-next-line:max-line-length
    return this._deckService.deckProcess._cardList;
  }

  navigateToNewDeck() {
    console.log('DUDE THIS WORKS');
  }


  sortChoosen(sort: string) {
    this._cardSort = sort;
    switch (sort) {
      case 'alpha-up':
          this._deckService.sortAlphaUp();
        break;
      case 'alpha-down':
          this._deckService.sortAlphaDown();
        break;
      case 'cmc-up':
          this._deckService.sortCmcUp();
        break;
      case 'cmc-down':
          this._deckService.sortCmcDown();
        break;
      case 'price-up':
          this._deckService.sortPriceUp();
        break;
      case 'price-down':
          this._deckService.sortPriceDown();
        break;
      case 'type-up':
          this._deckService.sortTypeUp();
        break;
      case 'type-down':
          this._deckService.sortTypeDown();
        break;
      default:
          this._cardSort = null;
        break;
    }
  }

  cardAmount(cardId) {
    return this._deckService.countOccurrences(this._deckService.deckProcess._deck.cards, cardId);
  }

  cardSideAmount(cardId) {
    return this._deckService.countOccurrences(this._deckService.deckProcess._deck.side, cardId);
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
    // console.log(card);
    if (this._selectedCard === card) {
      this._selectedCard = null;
      this.side = false;
    } else {
      // this._moxService.editDeck(deck);
      navigator.vibrate([30]);
      this._selectedCard = card;
    }
  }

  activateCardView() {
    this.cardView = true;
  }

  changetab(side) {
    this.selectedCard = null;
    switch (side) {
      case 'left':
        // alert('LEFT');
        switch (this.tab) {
          case 'statsTab':
              this.tab = 'socialTab';
            break;
          case 'socialTab':
              this.tab = 'deckList';
            break;
          case 'deckList':
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
              this.tab = 'deckList';
            break;
          case 'deckList':
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
