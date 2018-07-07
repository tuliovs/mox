import { AuthService } from './../../karn/_services/auth.service';
import {
    AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MoxDeck } from '../../_application/_models/_mox_models/MoxDeck';
import { MoxDeckService } from '../../_application/_services/mox-services/deck/mox-deck.service';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../../_application/_models/_scryfall-models/models';
import {
    ScryfallCardService
} from '../../_application/_services/scryfall-services/card/scryfall-card.service';
import { ToastService } from '../../_application/_services/toast/toast.service';


@Component({
  selector: 'app-mox-card',
  templateUrl: './mox-card.component.html',
  styleUrls: ['./mox-card.component.sass']
})
export class MoxCardComponent implements OnInit, AfterViewInit {
  public user: any;
  public card: Card;
  public cardDoc: AngularFirestoreDocument<Card>;
  public cardCollection: AngularFirestoreCollection<Card>;
  public deckCollection: AngularFirestoreCollection<MoxDeck>;
  public fireCard: Observable<Card>;
  public _Deck: MoxDeck;
  public subs: Subscription;
  constructor(
    private _dekService: MoxDeckService,
    private _scryservice: ScryfallCardService,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    public toast: ToastService,
    public auth: AuthService,
  ) { }

  ngOnInit() {
    this._dekService.getWorkingDeck().pipe(
      tap((deck) => {
        this._Deck = <MoxDeck>deck;
        }
      )
    ).subscribe();

    this.auth.user.pipe(
      tap((u) => {
        this.user = u;
      })
    ).subscribe();

    this.route.params.subscribe( params => {
        const id = params['id'];
        if (!id) {
          this.toast.sendMessage('Id não fornecido ou inválido', 'danger', this.user.uid);
          throw new Error('Id não fornecido ou inválido');
        }

        // REFATORAR PARA O MOX-SERVICE
        this.cardCollection = this.afs.collection('cards');
        this.cardDoc = this.cardCollection.doc(id);
        this.cardDoc.ref.get().then((doc) => {
          if (doc.exists) {
            this.card = <Card>doc.data();
            console.log('%c Data do Firebase - Document data:', 'color: green', doc.data());
          } else {
            this._scryservice.get(id).subscribe(
              card => {
                this.card = card;
                this.cardCollection.doc(card.id).set(card);
              }
            );
            this.toast.sendMessage('Doc not found, getting data from scryfall', 'info', this.user.uid);
            console.log('%c Doc not found, getting data from scryfall', 'color: purple');
          }
      }).catch((error) => {
          this.toast.sendMessage('Error getting document! Console has more info.', 'danger', this.user.uid);
          console.log('%c Error getting document: ', error, 'color: red');
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
      this.toast.sendMessage('Error getting Deck:', 'danger', this.user.uid);
      console.log('#ERROR REF 9887');
    }
  }
}
