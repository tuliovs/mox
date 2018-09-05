import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MoxDeck } from '../_application/_models/_mox_models/MoxDeck';
import { tap } from 'rxjs/operators';
import { MoxDeckService } from '../_application/_services/mox-services/deck/mox-deck.service';
import { AuthService } from '../karn/_services/auth.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';


@Component({
  selector: 'app-mox-deck-hub',
  templateUrl: './deck-hub.component.html',
  styleUrls: ['./deck-hub.component.sass']
})
export class DeckHubComponent implements OnInit, AfterViewInit {
  public deckList: MoxDeck[];
  private internalDeck: any;
  private deckCollection: AngularFirestoreCollection;
  constructor(
    private afs: AngularFirestore,
    private _moxService: MoxDeckService,
    private _state: ActionStateService,
    public auth: AuthService,
    private _router: Router) {
  }

  ngOnInit() {
    this.auth.getUser().subscribe(
      (u) => {
        if (u) {
          this.deckCollection = this.afs.collection('decks', ref => ref.where('ownerId', '==', u.uid));
          this.deckCollection.valueChanges().pipe(
            tap((docL) => {
                this.deckList = <MoxDeck[]>docL.sort((a, b) => {
                  if (a.name < a.name) {
                    return -1;
                  } else if (a.name > a.name) {
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
    this._moxService.getWorkingDeck().pipe(
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

  viewDeck(deck?) {
    if (deck) {
      this._router.navigateByUrl('/deck/' + deck.key);
    } else {
      this._router.navigateByUrl('/deck/' + this.internalDeck.key);
    }
  }

  deckSelected(deck: MoxDeck) {
    if (this.internalDeck === deck) {
      this.internalDeck = null;
    } else {
      this._moxService.editDeck(deck);
      this.internalDeck = deck;
    }
  }
}
