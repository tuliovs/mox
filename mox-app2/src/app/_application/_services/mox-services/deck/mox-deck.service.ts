import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Card } from '@application/_models/_scryfall-models/models';
import { MoxDeck } from '@application/_models/_mox_models/MoxDeck';
import { AuthService } from '@karn/_services/auth.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';

class DeckProcess {
  public active = false;
  public totalcards = 0;
  public status: string;
  public _deck: MoxDeck;
  public _cardList = [];
  public _sideList = [];
  public _deckStats: any;
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
    private _scryService: ScryfallSearchService,
    public _toast: ToastService,
    public _router: Router,
    public _cardService: MoxCardService
    ) {
  }

  public getWorkingDeck(): Observable<MoxDeck> {
    return this.workingDeck.asObservable();
  }

  public getCreatedDeck(): Observable<MoxDeck> {
    return this.creatingDeck;
  }

  public processStats() {
    if (this.deckProcess.active) {
      if (!this.deckProcess._deckStats) {
        this.deckProcess._deckStats = {};
        this.deckProcess._deckStats.key = this.deckProcess._deck.key;
      }

      if ( this.processPrice()
        && this.processLegalities()) {
          this.saveDeckStats(this.deckProcess._deckStats);
          this._state.setState('nav');
      } else {
        this._state.setState('error');
      }
    } else {
      console.error('No deck to process');
      //  this._toast.sendMessage('Error adding document: ', 'danger',  ownerId);
    }
  }

  private processPrice(): boolean {
    this.deckProcess._deckStats.totalPrice = 0;
    try {
      this.deckProcess.status = 'Processing Price';
      this.deckProcess._cardList.forEach((c: Card) => {
        if (c.usd) {
          this.deckProcess._deckStats.totalPrice += (this.countOccurrences(this.deckProcess._deck.cards, c.id) * parseFloat(c.usd));
        }
      });
      this.deckProcess._sideList.forEach((c: Card) => {
        if (c.usd) {
          this.deckProcess._deckStats.totalPrice += (this.countOccurrences(this.deckProcess._deck.side, c.id) * parseFloat(c.usd));
        }
      });

      this.deckProcess._deckStats.totalPrice = this.deckProcess._deckStats.totalPrice.toFixed(2);
      return true;

    } catch (error) {
      this.deckProcess.status = 'Error';
      this.deckProcess.errorList.push(error);
      return false;
    }
  }

  private processLegalities(): boolean {
    try {
      this.deckProcess.status = 'Processing Legalities';
      this.deckProcess._deck.legal = true;
      const f = this.deckProcess._deck.format;
      this.deckProcess._cardList.forEach((c: Card) => {
        if (c.legalities && c.legalities[f].valueOf() !== 'legal') {
          this.deckProcess._deck.legal = false;
        }
      });
      this.deckProcess._sideList.forEach((c: Card) => {
        if (c.usd) {
          this.deckProcess._deck.legal = false;
        }
      });
      return true;
    } catch (error) {
      this.deckProcess.status = 'Error';
      this.deckProcess.errorList.push(error);
      return false;
    }
  }

  public quickCreate(name?) {
    return new Promise((res, rej) => {
      this._auth.getUser().pipe(
        tap((user) => {
          if (user) {
            const d = new MoxDeck();
            d.key = this.makeId();
            d.name = (name) ? name : 'QuickDeck';
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
              rej(new Error('Error creating a new deck'));
            }).then(() => {
              this._toast.sendMessage('Deck Created!', 'success', d.ownerId);
              res(d);
            });
          } else {
            console.error('User not found!: ', user);
            rej(new Error('Error creating a new deck'));
          }
        })
      ).subscribe();
    });
  }

  editDeck(d: MoxDeck) {
    if (this.deckProcess.active && d.key === this.deckProcess._deck.key) {
      return;
    } else {
      this.deckProcess.active = true;
      this.deckProcess._deck = d;
      this.deckProcess._cardList = [];
      this.deckProcess._sideList = [];
      this.deckProcess.errorList = [];
      this.deckProcess.totalcards = (d.cards.length + d.side.length);
      if (this.deckProcess._deckStats && this.deckProcess._deckStats.key !== d.key) {
        this.deckProcess._deckStats = null;
      }
      this.getCardData();
      this.getDeckStats();
    }
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

  getDeck(deckId: string): Observable<MoxDeck> {
    this.deckCollection = this.afs.collection('decks');
    return this.deckCollection.doc<MoxDeck>(deckId).valueChanges();
  }

  getCardData() {
    this.deckCollection = this.afs.collection('decks');
    this.deckCollection.doc<MoxDeck>(this.deckProcess._deck.key).valueChanges()
    .pipe(
      tap((deck) => {
        if (deck) {
          if (!deck.side) { deck.side = [];  }
          this.editDeck(deck);
          this.getDeckStats();
          // this.deckProcess._cardList = [];
          // this.deckProcess._sideList = [];
          // this.deckProcess._deckStats = null;
          Array.from(new Set(deck.cards))
          .forEach((incard) => {
            this._cardService.getCard(incard).pipe(
              tap((x: Card) => {
                this._state.setState('cloud');
                this.deckProcess._cardList.push(x);
                if (Array.from(new Set(deck.cards)).length === this.deckProcess._cardList.length) {
                  this.cardSort(false);
                  this._state.setState('nav');
                  // console.log('Sort');
                }
              }),
            ).subscribe();
          });
          Array.from(new Set(deck.side))
          .forEach((incard) => {
            this._cardService.getCard(incard).pipe(
              tap((x: Card) => {
                this._state.setState('cloud');
                this.deckProcess._sideList.push(x);
                if (Array.from(new Set(deck.side)).length === this.deckProcess._sideList.length) {
                  this.cardSort(false);
                  this._state.setState('nav');
                  // console.log('Sort');
                }
              })
            ).subscribe();
          });
        }
      }),
    ).subscribe();
  }

  updateDeck() {
    if (this.deckProcess.active && this.deckProcess._deck) {
      this._state.setState('cloud');
      this.deckProcess.status = 'Saving';
      this.afs.collection('decks')
      .doc<MoxDeck>(this.deckProcess._deck.key)
      .update(this.deckProcess._deck)
      .then(() => { this._state.setState('nav'); })
      .catch((err) => {
        this.deckProcess.errorList.push(err);
        this._state.setState('error');
      });
    } else {
      this.deckProcess.status = 'Error';
      this.deckProcess.active = false;
      this._state.setState('error');
    }
  }

  deleteDeck(deck: MoxDeck) {
    this.deckProcess.active = false;
    this.deckProcess.status = 'inactive';
    this.deckProcess._deck = null;
    this.deckProcess._deckStats = null;
    this.deckProcess._cardList = null;
    this.deckProcess._sideList = null;
    this.afs.collection('decks').doc(deck.key).delete();
    this.afs.collection('decks-stats').doc(deck.key).delete();
    this._toast.sendMessage('Deck successfully deleted!', 'success', deck.ownerId);
  }

  getDeckStats() {
    if (this.deckProcess.active && this.deckProcess._deck) {
      this.afs.collection('deck-stats')
      .doc(this.deckProcess._deck.key).valueChanges()
      .pipe(
        tap((deckStats) => {
          console.log('getting stats: ', deckStats);
          this.deckProcess._deckStats = deckStats;
        })
      ).subscribe();
    } else {
      console.error('No deck in process');
    }
  }
  saveDeckStats(obj) {
    if (obj) {
      this._state.setState('cloud');
      this.deckCollection = this.afs.collection('decks-stats');
      this.deckCollection.doc(obj.key).set(Object.assign({}, obj)).catch((error) => {
        console.error('Error adding document: ', error);
        this.deckProcess.status = 'Error';
        this._state.setState('error');
        this.deckProcess.errorList.push(error);
      }).then(() => {
        this._state.setState('nav');
      });
    }
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
              'Done! Add to your: ' + this.deckProcess._deck.name + ' decklist.',
              'success',
              this.deckProcess._deck.ownerId);
          }).catch((err) => {
            this._toast.sendMessage(
              'Error! ' + err,
              'error',
              this.deckProcess._deck.ownerId);
          });
        })
      )
      .subscribe();

    } else {
      this.deckProcess.active = true;
      this.deckProcess._deck.cards.push(cardId);
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(this.deckProcess._deck.key).update({
        cards: this.deckProcess._deck.cards
      }).then((a) => {
        console.log('res: ', a);
        this._toast.sendMessage(
          'Done! Add to your: ' + this.deckProcess._deck.name + ' decklist.',
          'success',
          this.deckProcess._deck.ownerId);
      }).catch((err) => {
        this._toast.sendMessage(
          'Error! ' + err,
          'error',
          this.deckProcess._deck.ownerId);
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
              'Done! Add to your: ' + this.deckProcess._deck.name + ' side.',
              'success',
              this.deckProcess._deck.ownerId);
          }).catch((err) => {
            this._toast.sendMessage(
              'Error! ' + err,
              'error',
              this.deckProcess._deck.ownerId);
          });
        })
      )
      .subscribe();

    } else {
      this.deckProcess._deck.side.push(cardId);
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(this.deckProcess._deck.key).update({
        side: this.deckProcess._deck.side
      }).then(() => {
        this._toast.sendMessage(
          'Done! Add to your: ' + this.deckProcess._deck.name + ' side.',
          'success',
          this.deckProcess._deck.ownerId);
      }).catch((err) => {
        this._toast.sendMessage(
          'Error! ' + err,
          'error',
          this.deckProcess._deck.ownerId);
      });
    }
  }

  createDeckFromArena(cardList: any) {
    this.deckProcess.active = true;
    this.deckProcess.totalcards = 0;
    this.deckProcess.status = 'start';
    cardList.valueOf().split('\n').forEach(async elt => {
      if (elt && elt.length > 0) {
        const qnt = +elt.substr(0, 2);
        const cardname = elt.substr(2, elt.indexOf('(') - 2);
        const set = elt.substr(elt.indexOf('(') + 1, 3).toLowerCase().replace('dar', 'dom');
        const collectorsNumber = +elt.substr(elt.length - 2, 3);
        this.deckProcess.status = 'getting cards';
        this.deckProcess.totalcards = this.deckProcess.totalcards + qnt;
        this._scryService.mtgArenaSearch(set, collectorsNumber).pipe(
          tap((card: Card) => {
            for (let index = 1; index <= qnt; index++) {
              if (this.deckProcess._deck.cards.length >= 60) {
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

  importTxt(deck: MoxDeck, cardList: any) {
    return new Promise((res, rej) => {
      this.deckProcess.active = true;
      this.editDeck(deck);
      this.deckProcess.totalcards = 0;
      this.deckProcess.status = 'start';
      cardList.valueOf().split('\n').forEach(async elt => {
        if (elt && elt.length > 0) {
          const qnt = +elt.substr(0, 2);
          const cardname = elt.substr(2, elt.length);
          console.log('Qntd: ', qnt);
          console.log('Name: ', cardname);
          this.deckProcess.status = 'Getting cards';
          this.deckProcess.totalcards = this.deckProcess.totalcards + qnt;
          for (let index = 1; index <= qnt; index++) {
            if (this.deckProcess._deck.cards.length >= 60) {
              this._scryService.fuzzySearch(cardname).pipe(
                tap((c: Card) => {
                  this.addCard(c.id);
                  if (this.deckProcess.totalcards === (this.deckProcess._deck.cards.length + this.deckProcess._deck.side.length)) {
                    res(true);
                  }
                })
              ).subscribe();
            } else {
              this._scryService.fuzzySearch(cardname).pipe(
                tap((c: Card) => {
                  this.addCard(c.id);
                  if (this.deckProcess.totalcards === (this.deckProcess._deck.cards.length + this.deckProcess._deck.side.length)) {
                    res(true);
                  }
                })
              ).subscribe();
            }
          }
        }
      });
      // rej(new Error('Something is Wrong!'));
    });
  }

  public cardSort(order) {
    this.deckProcess._cardList = this.deckProcess._cardList.sort((a: Card, b: Card): number => {
      if (order) {
        if ( a.cmc < b.cmc ) { return -1; }
        if ( a.cmc > b.cmc ) { return 1; }
        return 0;
      } else {
        if ( a.cmc > b.cmc ) { return -1; }
        if ( a.cmc < b.cmc ) { return 1; }
        return 0;
      }
    });
    this.deckProcess._sideList = this.deckProcess._sideList.sort((a: Card, b: Card): number => {
      if (order) {
        if ( a.cmc < b.cmc ) { return -1; }
        if ( a.cmc > b.cmc ) { return 1; }
        return 0;
      } else {
        if ( a.cmc > b.cmc ) { return -1; }
        if ( a.cmc < b.cmc ) { return 1; }
        return 0;
      }
    });
    return order;
  }

  private makeId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  public countOccurrences(arr: string[], value: string) {
    let res = 0;
    arr.forEach(el => {
      if (el === value) {
        res++;
      }
    });
    return res;
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
