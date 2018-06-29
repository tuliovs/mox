import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ScryfallCardService } from '../../_application/_services/scryfall-services/card/scryfall-card.service';
import { Card } from '../../_application/_models/_scryfall-models/models';
import { CardMapper } from '../../_application/_mappers/scryfall-mappers/card/cardMapper';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { MoxDeck } from 'src/app/_application/_models/_mox_models/MoxDeck';
import { MoxDeckService } from 'src/app/_application/_services/mox-services/deck/mox-deck.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-mox-card',
  templateUrl: './mox-card.component.html',
  styleUrls: ['./mox-card.component.sass']
})
export class MoxCardComponent implements OnInit, AfterViewInit {
  public card: Card;
  public cardDoc: AngularFirestoreDocument<Card>;
  public cardCollection: AngularFirestoreCollection<Card>;
  public deckCollection: AngularFirestoreCollection<MoxDeck>;
  public fireCard: Observable<Card>;
  public _Deck: MoxDeck;
  public subs: Subscription;
  constructor(
    private _scryservice: ScryfallCardService,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private _dekService: MoxDeckService,
  ) { }

  ngOnInit() {
    this._dekService.getWorkingDeck().pipe(
      tap((deck) => {
        this._Deck = <MoxDeck>deck;
        }
      )
    ).subscribe();

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
            console.log('Data do Firebase - Document data:', doc.data(), 'color: green');
          } else {
            this._scryservice.get(id).subscribe(
              card => {
                this.card = card;
                this.cardCollection.doc(card.id).set(card);
              }
            );
            console.log('Doc not found, getting data from scryfall', 'color: purple');
          }
      }).catch(function(error) {
          console.log('Error getting document:', error, 'color: red');
      });
      // REFATORAR PRO MOX SERVICE
      }
    );
  }

  ngAfterViewInit() {
    this._dekService.getWorkingDeck().pipe(
      tap((deck) => {
        this._Deck = <MoxDeck>deck;
        }
      )
    ).subscribe();
  }

  setCover() {
    if (this._Deck) {
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(this._Deck.key).update({
        cover: this.card.image_uris.art_crop
    });
    } else {
      console.log('Erro! Deck não encontrado.');
    }
  }
}
