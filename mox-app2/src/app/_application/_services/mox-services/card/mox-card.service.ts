import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../../../_models/_scryfall-models/models';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class MoxCardService {
  cardCollection: AngularFirestoreCollection<Card>;
  card: Observable<Card[]>;
  constructor (private afs: AngularFirestore) {
  }

  fireStoreGet() {
    this.cardCollection = this.afs.collection('cards');
    this.card = this.cardCollection.valueChanges();
  }
}
