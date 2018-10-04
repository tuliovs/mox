import { Router } from '@angular/router';
import { ToastService } from '@application/_services/toast/toast.service';
import { Component, OnInit, Input } from '@angular/core';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { AuthService } from '@karn/_services/auth.service';
import { NgNavigatorShareService } from 'ng-navigator-share';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';

@Component({
  selector: 'app-mox-deck-context',
  templateUrl: './deck-context.component.html',
  styleUrls: ['./deck-context.component.sass'],
  animations: [
    trigger('deck-contextTrigger', [
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
export class DeckContextComponent implements OnInit {

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
  @Input() deck: any;
  @Input() icon;
  @Input() disabled;
  public componentState = 'closed';
  public lightboxActive = false;

  ngOnInit() {
  }

  processData() {
    navigator.vibrate([30]);
    this.closeContext();
    this._deckService.processStats();
  }

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
      this._deckService.forkDeck().then(
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

  delete() {
    if (confirm('This action can not be undone, are you sure?')) {
      this._deckService.deleteDeck(this.deck);
      this.deck = null;
      this.closeContext();
      this._router.navigate(['/deckhub']);
    }
  }

  activateContext() {
    navigator.vibrate([30]);
    this._deckService.editDeck(this.deck);
    this.lightboxActive = true;
    this.componentState = 'opened';
    this._state.setState('hidden');
    // console.log('#', this._deckService.deckProcess._deck);
  }

  closeContext() {
    this.lightboxActive = false;
    this.componentState = 'closed';
    this._state.returnState();
  }
}
