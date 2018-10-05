import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger, state, keyframes } from '@angular/animations';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
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

  async onFilePicked(event) {
    const reader = new FileReader();
    reader.readAsText(event.srcElement.files[0]);
    if (event.srcElement.files[0].name.includes('.dek')) {
      const me = this;
      reader.onload = async function () {
      const xmlDoc = reader.result.toString();
      if (xmlDoc) {
        me.showLoader = true;
        const deckName = event.srcElement.files[0].name.substring(0, event.srcElement.files[0].name.indexOf('.dek'));
        await me._deckService.quickCreate(deckName).then(
          async (queickDeck: MoxDeck) => {
            await me._deckService.importMTGO(queickDeck, xmlDoc)
            .then((importedDeck: MoxDeck) => {
              me._deckService.editDeck(importedDeck);
              setTimeout(
                () => {
                  me._state.returnState();
                  me.closeContext();
                  me._router.navigate(['deck/' + importedDeck.key]);
              }, 2500);
            })
            .catch((err) => {
              console.error(err);
            });
          }
        ).catch((err) => {
          console.error(err);
        });
      } else {
        alert('I`m sorry! I could not found any text to import.');
        console.error('No text founded');
        me.showLoader = false;
      }
    };
    } else {
      console.error('File not supported!');
      alert('File not supported!');
    }
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
