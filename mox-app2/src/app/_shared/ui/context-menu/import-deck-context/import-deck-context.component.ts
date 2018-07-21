import { Router } from '@angular/router';
import { Card } from '@application/_models/_scryfall-models/models';
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger, state, keyframes } from '@angular/animations';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { tap, finalize } from 'rxjs/operators';
import { MoxDeck } from '@application/_models/_mox_models/MoxDeck';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { ToastService } from '@application/_services/toast/toast.service';

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
        const cardname = elt.substr(2, elt.indexOf('(') - 2);
        const set = elt.substr(elt.indexOf('(') + 1, 3).toLowerCase().replace('dar', 'dom');
        const collectorsNumber = +elt.substr(elt.length - 2, 3);
        this._scryService.aernaSearch(set, collectorsNumber).pipe(
          tap((card: Card) => {
            for (let index = 1; index <= qnt; index++) {
              if (this._deckList.length >= 60) {
                if (card.name.trim() === cardname.trim()) {
                  this._sideList.push(card.id);
                } else {
                  this._scryService.fuzzySearch(cardname).pipe(
                    tap((c: Card) => {
                        this._sideList.push(c.id);
                    })
                  ).subscribe();
                }
              } else {
                if (card.name.trim() === cardname.trim()) {
                  this._deckList.push(card.id);
                } else {
                  this._scryService.fuzzySearch(cardname).pipe(
                    tap((c: Card) => {
                        this._deckList.push(c.id);
                    })
                  ).subscribe();
                }
              }
            }
            // TODO pelo amor de deus refatora isso pra algo minimamente entendivel, obg
          }),
          finalize(() => {
            // if (this._deckList.length === 60 || this._deckList.length === 75) {
              console.log('FINILIZE: ', this._deckList);
              this._deckService.createDeckFromArena(this._deckList, this._sideList);
              this.closeContext();
            // } else {
            //   console.log('?: ', this._deckList.length);
            // }
          }
        )).subscribe();
      }
    });
  }
}
