import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastService } from '@application/_services/toast/toast.service';
import { Component, OnInit, Input } from '@angular/core';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { AuthService } from '@karn/_services/auth.service';

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
    public auth: AuthService,
    private afs: AngularFirestore,
    public _deckService: MoxDeckService,
    public _state: ActionStateService,
    public _toast: ToastService
  ) { }
  @Input() deck: any;
  @Input() icon;
  @Input() disabled;
  public componentState = 'closed';
  public lightboxActive = false;

  ngOnInit() {
  }

  processData() {
    this.closeContext();
    this._state.setState('loading');
    this._deckService.processStats();
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
    this._deckService.editDeck(this.deck);
    this.lightboxActive = true;
    this.componentState = 'opened';
    this._state.setState('hidden');
    // console.log('#', this._deckService.deckProcess._deck);
  }

  closeContext() {
    this.lightboxActive = false;
    this.componentState = 'closed';
    this._state.setState('nav');
  }
}
