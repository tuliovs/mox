import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MoxDeck } from '../_application/_models/_mox_models/MoxDeck';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MoxDeckService } from '../_application/_services/mox-services/deck/mox-deck.service';
import { AuthService } from '../karn/_services/auth.service';

@Component({
  selector: 'app-mox-deck-hub',
  templateUrl: './deck-hub.component.html',
  styleUrls: ['./deck-hub.component.sass']
})
export class DeckHubComponent implements OnInit {
  public deckList: MoxDeck[];
  private internalDeck: any;
  private deckCollection: AngularFirestoreCollection;
  constructor(private afs: AngularFirestore, private _moxService: MoxDeckService, public auth: AuthService) {
  }

  ngOnInit() {
    this.auth.user.subscribe(
      (u) => {
        if (u) {
          this.deckCollection = this.afs.collection('decks', ref => ref.where('ownerId', '==' , u.uid));

        }
      }
    );
  }

  deckSelected(deck: MoxDeck) {
    this._moxService.editDeck(deck);
  }
}
