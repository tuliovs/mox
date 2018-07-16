import { Router } from '@angular/router';
import { Card } from '@application/_models/_scryfall-models/models';
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { tap } from 'rxjs/operators';
import { MoxDeck } from '@application/_models/_mox_models/MoxDeck';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { ToastService } from '@application/_services/toast/toast.service';

@Component({
  selector: 'app-mox-import-deck-context',
  templateUrl: './import-deck-context.component.html',
  styleUrls: ['./import-deck-context.component.sass'],
  animations: [
    trigger('importdeck-contextTrigger', [
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
export class ImportDeckContextComponent implements OnInit {
  public importState = 'closed';
  public lightboxActive = false;
  public importText: string;
  public showLoader = false;
  public _deckList: any[] = [];
  public _sideList: any[] = [];
  constructor(public _scryService: ScryfallSearchService,
              public _deckService: MoxDeckService,
              public toast: ToastService,
              public router: Router) { }

  ngOnInit() {
  }

  activateContext() {
    this.lightboxActive = true;
    this.importState = 'opened';
  }

  closeContext() {
    this.lightboxActive = false;
    this.importState = 'closed';
  }
  importDeck() {
    this.showLoader = true;
    const sideboard = false;
    this.importText.valueOf().split('\n').forEach(async elt => {
      if (elt && elt.length > 0) {
        const qnt = +elt.substr(0, 2);
        const set = elt.substr(elt.indexOf('(') + 1, 3).toLowerCase().replace('dar', 'dom');
        const collectorsNumber = +elt.substr(elt.length - 2, 3);
        this._scryService.aernaSearch(set, collectorsNumber).pipe(
          tap((card: Card) => {
            for (let index = 1; index <= qnt; index++) {
              if (this._deckList.length >= 60) {
                this._sideList.push(card.id);
              } else {
                this._deckList.push(card.id);
              }
            }
            // console.log('this.deckList> ', this._deckList);
          })
        ).subscribe();
      }
      // console.log('element> ', elt + ': ' + ' | ' + qnt + ' | ' + set + ' | ' + collectorsNumber);
    });
    setTimeout((c) => {
      if (this._deckList.length >= 60) {
        this._deckService.createDeckFromArena(this._deckList, this._sideList);
        this.closeContext();
        this.router.navigate(['/deckhub']);
        this._deckService.workingDeck.pipe(
          tap((deck) => {
            console.log('>> ', deck);
            this.toast.sendMessage('Deck Imported!', 'sucess', deck.ownerId);
            this.router.navigate(['/deckView/' + deck.key]);
          })
        ).subscribe();
      }
    }, 3000);
  }
}
