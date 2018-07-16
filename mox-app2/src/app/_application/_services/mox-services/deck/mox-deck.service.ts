import {
    AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MoxDeck } from '../../../_models/_mox_models/MoxDeck';
import { Card } from '../../../_models/_scryfall-models/models';
import { AuthService } from '@karn/_services/auth.service';
import { ToastService } from '@application/_services/toast/toast.service';

@Injectable()
export class MoxDeckService {
  private deckCollection: AngularFirestoreCollection<MoxDeck>;
  private deckDocument: AngularFirestoreDocument<MoxDeck>;
  public workingDeck = new Observable<MoxDeck>();
  constructor (private afs: AngularFirestore, private auth: AuthService, public toast: ToastService) {
  }

  // editDeck(d: MoxDeck) Observable<MoxDeck> {
  //   this.workingDeck = new of(d);
  //   return this.workingDeck;
  // }
  public getWorkingDeck(): Observable<MoxDeck> {
    return this.workingDeck;
  }

  editDeck(d: MoxDeck) {
    this.deckCollection = this.afs.collection('decks');
    this.workingDeck = this.deckCollection.doc<MoxDeck>(d.key).valueChanges();
  }

  setDeck(d: MoxDeck) {
    this.deckCollection = this.afs.collection('decks');
    this.deckCollection.doc(d.key).set(Object.assign({}, d)).catch((error) => {
      console.error('Error adding document: ', error);
      // this.toast.sendMessage('Error adding document: ', 'danger', '');
    });
    this.workingDeck = this.deckCollection.doc<MoxDeck>(d.key).valueChanges();
  }

  getDeck(id: string) {
    this.deckCollection = this.afs.collection('decks');
    return this.deckCollection.doc(id);
  }

  createDeckFromArena(cardList: any[], sideList?: any[]) {
    this.auth.user.pipe(
      tap((user) => {
        if (user) {
          const newDeck = new MoxDeck();
          newDeck.key = this.makeId();
          newDeck.name = 'Arena Imported Deck';
          newDeck.cover = 'https://img.scryfall.com/cards/art_crop/en/dom/1.jpg?1524789999';
          newDeck.legal = false;
          newDeck.ownerId = user.uid;
          newDeck.public = true;
          newDeck.froze = false;
          newDeck.cards = cardList;
          newDeck.side = sideList;
          newDeck.updated = [];
          this.setDeck(newDeck);
        }
      })
    ).subscribe();
  }

  private makeId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // addOneCard(deckId: any, cardId: any, side?: boolean) {
  //   // console.log('AddOneCard');
  //   if (!side) {
  //     this.deckCollection = this.afs.collection('decks');
  //     this.deckCollection.doc(deckId).update({
  //       cards: .push(cardId)
  //     });
  //   } else {
  //     // console.log('Sideboard');
  //   }
  // }
}
