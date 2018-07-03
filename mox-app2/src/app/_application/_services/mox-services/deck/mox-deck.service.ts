import {
    AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MoxDeck } from '../../../_models/_mox_models/MoxDeck';
import { Card } from '../../../_models/_scryfall-models/models';

@Injectable()
export class MoxDeckService {
  private deckCollection: AngularFirestoreCollection<MoxDeck>;
  private deckDocument: AngularFirestoreDocument<MoxDeck>;
  public workingDeck = new Observable<MoxDeck>();
  constructor (private afs: AngularFirestore) {
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
    });
  }
  getDeck(id: string) {
    this.deckCollection = this.afs.collection('decks');
    return this.deckCollection.doc(id);
  }
}
