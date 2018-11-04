import { Component, ViewChild, OnInit } from '@angular/core';
import { List } from '@application/_models/_scryfall-models/models';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';
import { FavoriteCards } from '@application/_models/_mox-models/Favorites';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { MatRipple } from '@angular/material';

@Component({
  selector: 'app-mox-search-hub',
  templateUrl: './search-hub.component.html',
  styleUrls: ['./search-hub.component.sass']
})
export class SearchHubComponent implements OnInit {
  public param: string;
  public searchResult: List = new List();
  public favoriteList: any[];
  public animationState: string;
  public resp_time = 0;
  public settings_stats = false;
  public showError = false;
  public cardView = false;
  public side = false;
  public searchState = 'closed';
  public _selectedCard;
  @ViewChild(MatRipple) ripple: MatRipple;
  constructor(
    private _searchService: ScryfallSearchService,
    private _deckService: MoxDeckService,
    public _cardService: MoxCardService,
    private _localstorageService: LocalstorageService,
    private _state: ActionStateService
  ) {
    this._state.getState().subscribe(stt => {
      this.animationState = stt;
    });
    const storage = this._localstorageService;
    const favList = <FavoriteCards>storage.favsStorage.get('cards');
    if (favList) {
      this.favoriteList = favList.actualFavs;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.ripple) {
        this.ripple.centered = true;
        this.ripple.radius = 20;
      }
      this._state.setState('nav');
    }, 1000);
  }

  selectedCard(card: any) {
    if (this._selectedCard === card) {
      this._selectedCard = null;
      this.side = false;
    } else {
      navigator.vibrate([30]);
      this._selectedCard = card;
    }
  }

  isState(p): boolean {
    return (this.animationState === p);
  }

  addCard(cardId) {
    navigator.vibrate([30]);
    this._deckService.addCard(cardId);
  }

  quickSearch(cardName) {
    navigator.vibrate([30]);
    this.searchGo(cardName);
  }

  clear() {
    this.searchResult = new List();
    this.settings_stats = false;
    const favs = <FavoriteCards>this._localstorageService.favsStorage.get('cards');
    if (favs) {
      this.favoriteList =  favs.actualFavs;
    }
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

  searchGo(param: string) {
    navigator.vibrate([30]);
    this._state.setState('loading');
    this.settings_stats = true;
    this.resp_time = Date.now();
    this._searchService.search(param).pipe(
        tap((list) => {
          this.searchResult = list;
          this.resp_time = Date.now() - this.resp_time;
          this.showError = false;
          this._state.returnState();
        }),
        catchError((err) => {
          console.log(err);
          if (err.status === 404) {
            this.showError = true;
            this.searchResult.data = null;
            this.settings_stats = false;
            navigator.vibrate([30, 30]);
            this._state.setState('error');
          }
          return throwError(err);
        })
      ).subscribe();
  }
}
