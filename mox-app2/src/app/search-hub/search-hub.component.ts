import { Component } from '@angular/core';
import { List } from '@application/_models/_scryfall-models/models';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';

@Component({
  selector: 'app-mox-search-hub',
  templateUrl: './search-hub.component.html',
  styleUrls: ['./search-hub.component.sass']
})
export class SearchHubComponent {
  public param: string;
  public searchResult: List = new List();
  public animationState: string;
  public resp_time = 0;
  public settings_stats = false;
  public showError = false;
  public searchState = 'closed';
  public selectedCard;
  constructor(
    private _searchService: ScryfallSearchService,
    private _deckService: MoxDeckService,
    private _state: ActionStateService
  ) {
    this._state.getState().subscribe(stt => {
      this.animationState = stt;
    });
  }

  selectCard(card: any) {
    if (this.selectedCard === card) {
      this.selectedCard = null;
    } else {
      navigator.vibrate([30]);
      this.selectedCard = card;
    }
  }

  isState(p): boolean {
    return (this.animationState === p);
  }

  addCard(cardId) {
    navigator.vibrate([30]);
    this._deckService.addCard(cardId);
  }

  searchGo() {
    // console.log('param: ', this.param);
    navigator.vibrate([30]);
    this._state.setState('loading');
    this.settings_stats = true;
    this.resp_time = Date.now();
    this._searchService.search(this.param).pipe(
        tap((list) => {
          // this._card = new CardMapper().map(card);
          this.searchResult = list;
          this.resp_time = Date.now() - this.resp_time;
          this.showError = false;
          this._state.returnState();
          console.log('>> ', this.searchResult);
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
