import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Card } from '@application/_models/_scryfall-models/models';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ScryfallCardService } from '@application/_services/scryfall-services/card/scryfall-card.service';

@Injectable({
  providedIn: 'root'
})
export class MoxCardService {
  public cardDoc: AngularFirestoreDocument<Card>;
  public cardCollection: AngularFirestoreCollection<Card>;
  constructor (
    public _afs: AngularFirestore,
    public _scryfallService: ScryfallCardService,
    public _localstorageService: LocalstorageService
    ) {
  }

  getCard(id): Observable<Card> {
    if (this._localstorageService.cardStorage && this._localstorageService.cardStorage.has(id)) {
      return of<Card>(this._localstorageService.cardStorage.get(id));
    } else {
      this.cardCollection = this._afs.collection('cards');
      this.cardDoc = this.cardCollection.doc(id);
      this.cardDoc.ref.get().then((doc) => {
        if (!doc.exists) {
          this._scryfallService.get(id).subscribe(
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

}
