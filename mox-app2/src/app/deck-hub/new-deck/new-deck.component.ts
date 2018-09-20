import { Component, OnInit } from '@angular/core';
import { MoxDeck } from '@application/_models/_mox_models/MoxDeck';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { AuthService } from '@karn/_services/auth.service';
import { Router } from '@angular/router';
import { ActionStateService } from '@application/_services/action-state/action-state.service';

@Component({
  selector: 'app-mox-new-deck',
  templateUrl: './new-deck.component.html',
  styleUrls: ['./new-deck.component.sass']
})
export class NewDeckComponent implements OnInit {
  public newDeck: MoxDeck;
  public formats = [
    '1v1',
    'brawl',
    'commander',
    'duek',
    'frontier',
    'future',
    'legacy',
    'modern',
    'pauper',
    'penny',
    'standard',
    'vintage'
  ];

  constructor(
    private _moxService: MoxDeckService,
    private _auth: AuthService,
    private _state: ActionStateService,
    private _router: Router
  ) {
    this.newDeck = new MoxDeck();
    this.newDeck.key = this.makeId();
    this.newDeck.name = '';
    this.newDeck.cover = '';
    this.newDeck.legal = false;
    this.newDeck.ownerId = '[EMPTY_OWNER]';
    this.newDeck.public = true;
    this.newDeck.froze = false;
    this.newDeck.cards = [];
    this.newDeck.updated = [];
  }

  ngOnInit() {
      this._auth.getUser().subscribe((u) => {
        if (u) {
          this.newDeck.ownerId = u.uid;
          this.newDeck.ownerName = u.displayName;
        }
      }
    );
  }

  createDeck() {
    this._moxService.setDeck(this.newDeck);
    this._router.navigate(['/deckhub']);
  }

  quickDeck() {
    this._state.setState('loading');
    this._moxService.quickCreate();
  }

  cloneDeck() {
    alert('Not Implemented!');
  }

  private makeId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}
