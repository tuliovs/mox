import { Component, OnInit, Input } from '@angular/core';
import { ScryfallCardService } from '../../_application/_services/scryfall-services/card/scryfall-card.service';
import { Card } from '../../_application/_models/_scryfall-models/models';
import { CardMapper } from '../../_application/_mappers/scryfall-mappers/card/cardMapper';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mox-card',
  templateUrl: './mox-card.component.html',
  styleUrls: ['./mox-card.component.sass']
})
export class MoxCardComponent implements OnInit {
  card: Card;
  cardDoc: AngularFirestoreDocument<Card>;
  cardCollection: AngularFirestoreCollection<Card>;
  fireCard: Observable<Card>;
  constructor(
    private _scryservice: ScryfallCardService,
    private afs: AngularFirestore,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.params.subscribe( params => {
        const id = params['id'];
        if (!id) {
          throw new Error('Id não fornecido ou inválido');
        }


        // REFATORAR PARA O MOX-SERVICE
        this.cardCollection = this.afs.collection('cards');
        this.cardDoc = this.cardCollection.doc(id);
        this.cardDoc.ref.get().then((doc) => {
          if (doc.exists) {
            this.card = <Card>doc.data();
            console.log('Data do Firebase - Document data:', doc.data());
          } else {
            this._scryservice.get(id).subscribe(
              card => {
                this.card = card;
                this.cardCollection.doc(card.id).set(card);
              }
            );
            console.log('Doc not found, getting data from scryfall');
          }
      }).catch(function(error) {
          console.log('Error getting document:', error);
      });
      // REFATORAR PRO MOX SERVICE
      }
    );
  }
}
