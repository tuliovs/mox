import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';
import { tap } from 'rxjs/operators';
import { AuthService } from '@karn/_services/auth.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';

@Component({
  selector: 'app-mox-deck-hub',
  templateUrl: './deck-hub.component.html',
  styleUrls: ['./deck-hub.component.sass']
})
export class DeckHubComponent implements OnInit, AfterViewInit {
  public deckList: MoxDeck[];
  public formats = [
    'all',
    'standard',
    'modern',
    'legacy',
    'commander',
    'pauper',
    'vintage',
    'brawl',
    '1v1',
    'duek',
    'penny',
    'frontier',
    'future'
  ];
  private internalDeck: any;
  private formatSelected: string;
  private deckCollection: AngularFirestoreCollection;
  constructor(
    private _afs: AngularFirestore,
    private _deckService: MoxDeckService,
    private _state: ActionStateService,
    public _auth: AuthService,
    private _router: Router) {
  }

  ngOnInit() {
    this._auth.getUser().subscribe(
      (u) => {
        if (u) {
          this._afs.collection('users').doc(u.uid).valueChanges().pipe(
            tap((moxUserData: any) => {
              if (moxUserData.favoriteFormat) { this.formatSelected = moxUserData.favoriteFormat; }
            })
          ).subscribe();
          this.deckCollection = this._afs.collection('decks', ref => ref.where('ownerId', '==', u.uid));
          this.deckCollection.valueChanges().pipe(
            tap((docL) => {
                this.deckList = <MoxDeck[]>docL.sort((a, b) => {
                  if (a.name < b.name) {
                    return -1;
                  } else if (a.name > b.name) {
                    return 1;
                  } else {
                    return 0;
                  }
                } );
                this._state.setState('nav');
                // console.log(this.deckList);
              }
            )
          ).subscribe();
        }
      }
    );
  }

  ngAfterViewInit() {
    this._deckService.getWorkingDeck().pipe(
      tap((workingDeck) => {
        this.internalDeck = workingDeck;
        // console.log('this', this.internalDeck);
        // console.log('that', workingDeck);
      })
    ).subscribe();
  }

  newDeck() {
    this._router.navigateByUrl('/deck/new');
  }

  setFormat(f) {
    (f === 'all') ? this.formatSelected = null : this.formatSelected = f;
  }

  filteredDeckList() {
    return (this.formatSelected) ? this.deckList.filter(x => x.format === this.formatSelected) : this.deckList;
  }

  deckSelected(deck: MoxDeck) {
    if (this.internalDeck === deck) {
      navigator.vibrate([30, 30]);
      this.internalDeck = null;
      this._state.setState('nav');
    } else {
      navigator.vibrate([30]);
      this._deckService.editDeck(deck);
      this.internalDeck = deck;
      this._state.setState('view');
    }
  }
}
