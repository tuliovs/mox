import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '@application/_models/_scryfall-models/models';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ScryfallCardService } from '@application/_services/scryfall-services/card/scryfall-card.service';

@Injectable({
  providedIn: 'root'
})
export class MoxCardService {
  public cardDoc: AngularFirestoreDocument<Card>;
  public cardCollection: AngularFirestoreCollection<Card>;
  constructor (private afs: AngularFirestore, private _scryservice: ScryfallCardService) {
  }

  getCard(id): Observable<Card> {
    this.cardCollection = this.afs.collection('cards');
    this.cardDoc = this.cardCollection.doc(id);
    this.cardDoc.ref.get().then((doc) => {
      if (!doc.exists) {
        this._scryservice.get(id).subscribe(
          scrycard => {
            console.log('%c Doc not found, getting data from scryfall', 'color: purple', scrycard);
            this.cardCollection.doc(scrycard.id).set(scrycard);
          }
        );
      }
    }).catch(function(error) {
      console.log('%cError getting document:', 'color: red', error);
    });

    return this.cardCollection.doc<Card>(id).valueChanges();
  }

}
