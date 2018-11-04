import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { Router } from '@angular/router';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';

@Component({
  selector: 'app-mox-deck-import',
  templateUrl: './deck-import.component.html',
  styleUrls: ['./deck-import.component.sass']
})
export class DeckImportComponent implements OnInit {
  public importText: string;
  public _deckList: string[] = [];
  public _sideList: string[] = [];
  public showLoader = false;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  constructor(
    public _scryService: ScryfallSearchService,
    public _deckService: MoxDeckService,
    public _router: Router,
    public _state: ActionStateService,
    public toast: ToastService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  closeContext() {
    this.cancel.emit();
    this._state.returnState();
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
