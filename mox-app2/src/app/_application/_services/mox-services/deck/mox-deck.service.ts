import { Card } from './../../../_models/_scryfall-models/models';
import { ActionStateService } from './../../action-state/action-state.service';
import { Router } from '@angular/router';
import {
    AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MoxDeck } from '../../../_models/_mox_models/MoxDeck';
import { AuthService } from '@karn/_services/auth.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';

class DeckProcess {
  public active = false;
  public totalcards = 0;
  public status: string;
  public processingDeck: MoxDeck;
  public errorList: string[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class MoxDeckService {
  private deckCollection: AngularFirestoreCollection<MoxDeck>;
  // private deckDocument: AngularFirestoreDocument<MoxDeck>;
  private workingDeck = new Subject<MoxDeck>();
  private creatingDeck = new Observable<MoxDeck>();
  public deckProcess = new DeckProcess();
  constructor (
    private afs: AngularFirestore,
    private _auth: AuthService,
    private _state: ActionStateService,
    public _toast: ToastService,
    private _scryService: ScryfallSearchService,
    public _router: Router
    ) {
  }

  public getWorkingDeck(): Observable<MoxDeck> {
    return this.workingDeck.asObservable();
  }

  public getCreatedDeck(): Observable<MoxDeck> {
    return this.creatingDeck;
  }

  public quickCreate() {
    this._auth.getUser().pipe(
      tap((user) => {
        if (user) {
          const d = new MoxDeck();
          d.key = this.makeId();
          d.name = 'QuickDeck';
          d.cover = '';
          d.legal = false;
          d.ownerId = user.uid;
          d.ownerName = user.displayName;
          d.public = true;
          d.froze = false;
          d.cards = [];
          d.side = [];
          d.updated = [];
          this.deckCollection = this.afs.collection('decks');
          this.deckCollection.doc(d.key).set(Object.assign({}, d)).catch((error) => {
            console.error('Error adding document: ', error);
            this._toast.sendMessage('Error adding document: ', 'danger', d.ownerId);
          }).then(() => {
            this._toast.sendMessage('Deck Created!', 'success', d.ownerId);
            this.workingDeck.lift(this.deckCollection.doc<MoxDeck>(d.key).valueChanges);
            this.deckProcess.active = true;
            this.deckProcess.processingDeck = d;
          });
        } else {
          console.error('User not found!: ', user);
          return null;
        }
      })
    ).subscribe();
  }

  editDeck(d: MoxDeck) {
    this.deckCollection = this.afs.collection('decks');
    this.workingDeck.lift(this.deckCollection.doc<MoxDeck>(d.key).valueChanges);
    this.deckCollection.doc<MoxDeck>(d.key).valueChanges().pipe(
      tap(
        (deck) => {
          this.deckProcess.active = true;
          this.deckProcess.processingDeck = deck;
        }
      )
    ).subscribe();
    // this.deckCollection.doc<MoxDeck>(d.key).valueChanges().lift(this.workingDeck.asObservable);
  }

  setDeck(d: MoxDeck) {
    if (d) {
      d = this.deckFix(d);
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(d.key).set(Object.assign({}, d)).catch((error) => {
        console.error('Error adding document: ', error);
        this._toast.sendMessage('Error adding document: ', 'danger', d.ownerId);
      }).then(() => {
        this._toast.sendMessage('Deck Created!', 'success', d.ownerId);
        // this._router.navigateByUrl('/deckhub');
      });
    }
  }

  getDeck(id: string) {
    this.deckCollection = this.afs.collection('decks');
    return this.deckCollection.doc(id);
  }

  updateDeck(d: MoxDeck) {
    console.log('UPDATE: ', d);
    this._state.setState('loading');
    this.afs.collection('dekcs').doc(d.key).update(Object.assign({}, d))
    .then(() => {
        this._state.setState('nav');
    });
  }

  addCard(cardId: string, deckId?: string) {
    if (deckId) {
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(deckId).valueChanges()
      .pipe(
        tap((tempDeck: MoxDeck) => {
          tempDeck.cards.push(cardId);
          this.deckCollection.doc(tempDeck.key).update({
            cards: tempDeck.cards
          }).then(() => {
            this._toast.sendMessage(
              'Done! Add to your: ' + this.deckProcess.processingDeck.name + ' decklist.',
              'success',
              this.deckProcess.processingDeck.ownerId);
          });
        })
      )
      .subscribe();

    } else {
      this.deckProcess.active = true;
      this.deckProcess.processingDeck.cards.push(cardId);
      this.deckCollection.doc(this.deckProcess.processingDeck.key).update({
        cards: this.deckProcess.processingDeck.cards
      }).then(() => {
        this._toast.sendMessage(
          'Done! Add to your: ' + this.deckProcess.processingDeck.name + ' decklist.',
          'success',
          this.deckProcess.processingDeck.ownerId);
      });
    }
  }

  addCardSide(cardId: string, deckId?: string) {
    if (deckId) {
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(deckId).valueChanges()
      .pipe(
        tap((tempDeck: MoxDeck) => {
          tempDeck.side.push(cardId);
          this.deckCollection.doc(tempDeck.key).update({
            side: tempDeck.side
          }).then(() => {
            this._toast.sendMessage(
              'Done! Add to your: ' + this.deckProcess.processingDeck.name + ' side.',
              'success',
              this.deckProcess.processingDeck.ownerId);
          });
        })
      )
      .subscribe();

    } else {
      this.deckProcess.processingDeck.side.push(cardId);
      this.deckCollection.doc(this.deckProcess.processingDeck.key).update({
        side: this.deckProcess.processingDeck.side
      }).then(() => {
        this._toast.sendMessage(
          'Done! Add to your: ' + this.deckProcess.processingDeck.name + ' side.',
          'success',
          this.deckProcess.processingDeck.ownerId);
      });
    }
  }

  createDeckFromArena(cardList: any) {
    this.deckProcess.active = true;
    this.deckProcess.totalcards = 0;
    this.deckProcess.status = 'start';
    cardList.valueOf().split('\n').forEach(async elt => {
      if (elt && elt.length > 0) {
        this.deckProcess.status = 'getting cards';
        const qnt = +elt.substr(0, 2);
        this.deckProcess.totalcards = this.deckProcess.totalcards + qnt;
        const cardname = elt.substr(2, elt.indexOf('(') - 2);
        const set = elt.substr(elt.indexOf('(') + 1, 3).toLowerCase().replace('dar', 'dom');
        const collectorsNumber = +elt.substr(elt.length - 2, 3);
        this._scryService.mtgArenaSearch(set, collectorsNumber).pipe(
          tap((card: Card) => {
            for (let index = 1; index <= qnt; index++) {
              if (this.deckProcess.processingDeck.cards.length >= 60) {
                if (card.name.trim() === cardname.trim()) {
                  this.addCard(card.id);
                } else {
                  this._scryService.fuzzySearch(cardname).pipe(
                    tap((c: Card) => {
                      this.addCard(c.id);
                    })
                  ).subscribe();
                }
              } else {
                if (card.name.trim() === cardname.trim()) {
                  this.addCard(card.id);
                } else {
                  this._scryService.fuzzySearch(cardname).pipe(
                    tap((c: Card) => {
                      this.addCard(c.id);
                    })
                  ).subscribe();
                }
              }
            }
          })
        ).subscribe();
      }
    });
  }

  private makeId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  deckFix(deck: MoxDeck): MoxDeck {
    // FIX deckList -> Sidelist
    while (deck.cards.length > 60) {
      const ca = deck.cards.pop();
      deck.side.push(ca);
    }
    // console.log('fixedDeck: ', deck);
    return deck;
  }
}
