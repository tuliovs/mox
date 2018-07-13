import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../../../_models/_scryfall-models/models';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ScryfallCardService } from '@application/_services/scryfall-services/card/scryfall-card.service';

@Injectable()
export class MoxCardService {
  public cardDoc: AngularFirestoreDocument<Card>;
  public cardCollection: AngularFirestoreCollection<Card>;
  public _card = new Observable<Card>();
  constructor (private afs: AngularFirestore, private _scryservice: ScryfallCardService) {
  }

  getCard(id) {
    this.cardCollection = this.afs.collection('cards');
    this.cardDoc = this.cardCollection.doc(id);
    this.cardDoc.ref.get().then((doc) => {
      if (doc.exists) {
        console.log('%c Data do Firebase - Document data:', 'color: green', doc.data());
        this._card = this.cardCollection.doc<Card>(id).valueChanges();
      } else {
        this._scryservice.get(id).subscribe(
          scrycard => {
            console.log('%c Doc not found, getting data from scryfall', 'color: purple', scrycard);
            this.cardCollection.doc(scrycard.id).set(scrycard);
            this._card = this.cardCollection.doc<Card>(id).valueChanges();
          }
        );
      }
  }).catch(function(error) {
      console.log('%cError getting document:', 'color: red', error);
  });
  }
}
