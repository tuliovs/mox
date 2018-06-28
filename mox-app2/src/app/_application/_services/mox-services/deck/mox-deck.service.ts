import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { MoxDeck } from '../../../_models/_mox_models/MoxDeck';
import { Card } from '../../../_models/_scryfall-models/models';

@Injectable()
export class MoxDeckService {
  private deckCollection: AngularFirestoreCollection<MoxDeck>;
  private deckDocument: AngularFirestoreDocument<MoxDeck>;
  public workingDeck = new Subject<MoxDeck>();
  constructor (private afs: AngularFirestore) {
  }

  // editDeck(d: MoxDeck) Observable<MoxDeck> {
  //   this.workingDeck = new of(d);
  //   return this.workingDeck;
  // }
  public getWorkingDeck(): Observable<MoxDeck> {
    return this.workingDeck.asObservable();
  }

  editDeck(d: MoxDeck) {
    this.deckCollection = this.afs.collection('decks');
    this.deckCollection.doc(d.key).ref.onSnapshot( (doc) => {
      this.workingDeck.next(<MoxDeck>doc.data());
    });
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
