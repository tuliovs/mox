import { Router } from '@angular/router';
import { Card } from '@application/_models/_scryfall-models/models';
import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger, state, keyframes } from '@angular/animations';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { tap, finalize } from 'rxjs/operators';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';

export const bounceInDown = [
  style({transform: 'translate3d(0, -3000px, 0)', opacity: 0, offset: .0}),
  style({transform: 'translate3d(0, 25px, 0)', opacity: 1, offset: .60}),
  style({transform: 'translate3d(0, -10px, 0)', offset: .75}),
  style({transform: 'translate3d(0, 5px, 0)', offset: .90}),
  style({transform: 'translate3d(0, 0, 0)', offset: 1}),
];

@Component({
  selector: 'app-mox-import-deck-context',
  templateUrl: './import-deck-context.component.html',
  styleUrls: ['./import-deck-context.component.sass'],
  animations: [
    trigger('importdeck-contextTrigger', [
      state('closed', style({
        transform: 'translate3d(-100%, 0, 0)',
        display: 'none'
      })),
      transition('*=>opened', animate('800ms', keyframes(bounceInDown))),
      transition('opened=>closed', animate('200ms'))
    ])
  ]
})

export class ImportDeckContextComponent implements OnInit {
  public importState = 'closed';
  public lightboxActive = false;
  public importText: string;
  public showLoader = false;
  public _deckList: string[] = [];
  public _sideList: string[] = [];
  public _actualState: string;
  constructor(public _scryService: ScryfallSearchService,
              public _deckService: MoxDeckService,
              public _router: Router,
              public _state: ActionStateService,
              public toast: ToastService,
              public router: Router) { }

  ngOnInit() {
  }

  activateContext() {
    navigator.vibrate([30]);
    this._state.setState('hidden');
    this.lightboxActive = true;
    this.importState = 'opened';
  }

  closeContext() {
    this._state.returnState();
    this.lightboxActive = false;
    this.importState = 'closed';
  }

  async importDeckArena() {
    navigator.vibrate([30]);
    if (this.importText && this.importText.length > 0) {
      this.showLoader = true;
      await this._deckService.quickCreate('Imported Deck - Arena').then(
        async (deck: MoxDeck) => {
          await this._deckService.importArena(deck, this.importText)
          .then((dk: MoxDeck) => {
            this._deckService.editDeck(deck);
            this._state.returnState();
            this.closeContext();
            this._router.navigate(['deck/' + dk.key]);
          }).catch((err) => {
            console.error(err);
          });
        }
      );
    } else {
      alert('I`m sorry! I could not found any text to import.');
      console.error('No text founded');
      this.showLoader = false;
    }
  }

  async importDeckTxt() {
    navigator.vibrate([30]);
    if (this.importText && this.importText.length > 0) {
      this.showLoader = true;
      await this._deckService.quickCreate('Imported Deck - Txt').then(
        async (deck: MoxDeck) => {
          await this._deckService.importTxt(deck, this.importText)
          .then((dk: MoxDeck) => {
            this._state.returnState();
            this.closeContext();
            this._router.navigate(['deck/' + dk.key]);
          }).catch((err) => {
            console.error(err);
          });
        }
      );
    } else {
      alert('I`m sorry! I could not found any text to import.');
      console.error('No text founded');
      this.showLoader = false;
    }
  }
}
