import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnChanges } from '@angular/core';
import { ToastService } from '@application/_services/toast/toast.service';
import { Router } from '@angular/router';
import { AuthService } from '@karn/_services/auth.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { NgNavigatorShareService } from 'ng-navigator-share';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';

@Component({
  selector: 'app-mox-deck-action',
  templateUrl: './deck-action.component.html',
  styleUrls: ['./deck-action.component.sass']
})

export class DeckActionComponent implements OnInit, OnChanges {

  constructor(
    public _router: Router,
    public _auth: AuthService,
    public _deckService: MoxDeckService,
    private ngNavigatorShareService: NgNavigatorShareService,
    public _state: ActionStateService,
    public _toast: ToastService
  ) {
    this.ngNavigatorShareService = ngNavigatorShareService;
  }
  @Input() deck: MoxDeck;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() collAddChoosen: EventEmitter<any> = new EventEmitter();
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.active && changes.active.firstChange === false && changes.active.currentValue === true) {
      console.log(changes);
      navigator.vibrate([30]);
      this.closeContext();
    }
  }

  processData() {
    navigator.vibrate([30]);
    this.closeContext();
    this._deckService.statTools.processStats(this._deckService.deckProcess);
  }

<<<<<<< HEAD
  collPicker() {
    navigator.vibrate([30]);
    this.collAddChoosen.emit(this.deck.key);
    this.closeContext();
  }

=======
>>>>>>> parent of ee554d1d... --many many collection things
  share() {
    this.ngNavigatorShareService.share({
      title: 'Mox',
      text: '[Mox]DeckList - ' + this._deckService.deckProcess._deck.name,
      url: 'https://mox-mtg.firebaseapp.com/deck/' + this._deckService.deckProcess._deck.key
    }).then( (response) => {
      console.log(response);
      this.closeContext();
      this._state.returnState();
    })
    .catch( (error) => {
      console.log(error);
      alert('Error! ' + error);
    });
  }

  forkDeck() {
    if (confirm('Hi dear friend! This action make a copy of this deck for you! Is that what you want?')) {
      this.closeContext();
      const pro = this._deckService.deckProcess;
      this._deckService.fork(pro).then(
        (deck: MoxDeck) => {
          this._router.navigate(['deck/' + deck.key]);
        }
      ).catch(
        (err) => {
          console.error('Error! ' + err);
        }
      );
    }
  }

  closeContext() {
    this.cancel.emit();
    this._state.returnState();
  }
}
