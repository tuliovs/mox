import { DeckProcess } from './../../../../_application/_models/_mox-models/MoxDeck';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { Router } from '@angular/router';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';
import { DeckIO } from '@application/_utils/io';
import { async } from 'rxjs/internal/scheduler/async';
import { AngularFirestore } from '@angular/fire/firestore';

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
  public errorList?;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  constructor(
    public _afs: AngularFirestore,
    public _scryService: ScryfallSearchService,
    public _deckService: MoxDeckService,
    public _router: Router,
    public _state: ActionStateService,
    public toast: ToastService,
    public router: Router
  ) {
    this._deckService.ioTools = new DeckIO(this._scryService);
  }

  ngOnInit() {
  }

  return() {
    this.showLoader = false;
  }

  cardAmount(cardId) {
    return this._deckService.statTools.countOccurrences(this._deckService.deckProcess._deck.cards, cardId);
  }

  cardPlus(event) {
    navigator.vibrate([30]);
    this._deckService.deckProcess._deck.cards.push(event);
  }

  cardMinus(event) {
    navigator.vibrate([30]);
    const deck = this._deckService.deckProcess._deck;
    deck.cards.splice(deck.cards.indexOf(event), 1);
  }

  saveDeck() {
    const s = this._deckService;
    this._afs.collection('decks').doc(s.deckProcess._deck.key).ref.get()
    .then(async (doc) => {
      if (doc.exists) {
        s.updateDeck(s.deckProcess);
      } else {
        await s.setDeck(s.deckProcess._deck)
        .then( sk => this._deckService.editDeck(sk._deck))
        .then( kk => this._deckService.statTools.processStats(kk))
        .then( dd => this._deckService.setDeckStats(dd))
        .then( dp => {
          this._state.returnState();
          this.closeContext();
          this._router.navigate(['deck/' + dp._deck.key]);
        })
        .catch(
          (err) => {
            console.error(err);
          }
        );
      }
    });
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
        const process = me._deckService.deckProcess;
        await me._deckService.quickCreate(deckName)
        .then(async quickDeck => process._deck = quickDeck)
        .then(me._deckService.ioTools.importMTGO(process, xmlDoc))
        .then(async ak => me._deckService.setDeck(ak))
        .then(async bk => me._deckService.editDeck(bk._deck))
        .catch(err => {
          console.error(err);
        })
        .then(async deckPro => me._deckService.statTools.processStats(me._deckService.deckProcess)
          .then(() => {
            if (deckPro) {
              me._state.returnState();
              me.closeContext();
              me._router.navigate(['deck/' + deckPro._deck.key]);
            }
          })
          .catch(err => {
            console.error(err);
          })
        );
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
      const process = this._deckService.deckProcess;
      this.showLoader = true;
      await this._deckService.quickCreate('Imported Deck - Arena')
      .then(qk => this._deckService.ioTools.importArena(process, this.importText))
      .then(ik => this._deckService.setDeck(ik))
      .then(sk => this._deckService.editDeck(sk._deck))
      .then(dP => this._deckService.statTools.processStats(dP))
      .then((pp: DeckProcess) => {
        this._state.returnState();
        this.closeContext();
        this._router.navigate(['deck/' + pp._deck.key]);
      })
      .catch(err => {
        console.error(err);
        this.errorList = err;
      });

    } else {
      alert('I`m sorry! I could not found any text to import.');
      this.showLoader = false;
    }
  }

  async importDeckTxt() {
    navigator.vibrate([30]);
    if (this.importText && this.importText.length > 0) {
      const process = this._deckService.deckProcess;
      this.showLoader = true;
      await this._deckService.quickCreate('Imported Deck - Txt')
      .then(qk => this._deckService.ioTools.importTxt(process, this.importText))
      .then(dk => this._deckService.setDeck(dk))
      .then(sk => this._deckService.editDeck(sk._deck))
      .then(dP => this._deckService.statTools.processStats(dP))
      .then((pp: DeckProcess) => {
        this._state.returnState();
        this.closeContext();
        this._router.navigate(['deck/' + pp._deck.key]);
      })
      .catch((err) => {
        console.error(err);
        this.errorList = err;
      });
    } else {
      alert('I`m sorry! I could not found any text to import.');
      this.showLoader = false;
    }
  }

}
