import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Card } from '@application/_models/_scryfall-models/models';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';
import { AuthService } from '@karn/_services/auth.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';
import { promises } from 'fs';

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
  public _user;
  constructor (
    private afs: AngularFirestore,
    private _auth: AuthService,
    private _state: ActionStateService,
    private _localstorageService: LocalstorageService,
    private _scryService: ScryfallSearchService,
    public _toast: ToastService,
    public _router: Router,
    public _cardService: MoxCardService
    ) {
      this._auth.getUser().pipe(
        tap((user) => {
          this._user = user;
        })
      ).subscribe();
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
      this._state.setState('loading');
      Promise.all([
        this.processPrice(),
        this.processLegalities(),
        this.processCardTypesQtds(),
        this.processColorIdentity(),
      ]).then(
        () => {
          this.deckProcess._deckStats.processDate = new Date();
          this.saveDeckStats(this.deckProcess._deckStats);
          this.updateDeck();
          // console.log('[STATS]: ', this.deckProcess._deckStats);
        }
      ).catch(
        (err) => {
          this.deckProcess.errorList.push(err);
          console.error(err);
          this._state.setState('error');
        }
      );
    } else {
      console.error('No deck to process');
      //  this._toast.sendMessage('Error adding document: ', 'danger',  ownerId);
    }
  }

  private processPrice() {
    return new Promise((resolve, reject) => {
      try {
        this.deckProcess.status = 'Processing Price';
        const t = this.deckProcess._cardList
          .reduce((acc: number, cur) => acc + (this.countOccurrences(this.deckProcess._deck.cards, cur.id) * Number(cur.usd)), 0);

        const s = this.deckProcess._sideList
          .reduce((acc: number, cur) => acc + (this.countOccurrences(this.deckProcess._deck.cards, cur.id) * Number(cur.usd)), 0);

        this.deckProcess._deckStats.totalPrice = (t + s).toFixed(2);
        resolve(true);
      } catch (err) {
        this.deckProcess.status = 'Error';
        console.error(err);
        this.deckProcess.errorList.push(err);
        reject(new Error('Error processing processPrice'));
      }
    });
  }

  private processCardTypesQtds() {
    return new Promise((resolve, reject) => {
      try {
        this.deckProcess.status = 'Processing Card Types';
        const typeLineCounter = {
          totalCards: this.deckProcess._cardList.length,
          d_totalLands: this.countTypes('land'),
          d_totalCreatures: this.countTypes('creature'),
          d_totalInstants: this.countTypes('instant'),
          d_totalSorcery: this.countTypes('sorcery'),
          d_totalArtifacts: this.countTypes('artifact'),
          d_totalEnchantments: this.countTypes('enchantment'),
          d_totalPlaneswalkers: this.countTypes('planeswalker'),
        };
        this.deckProcess._deckStats.typeLineCounter = typeLineCounter;
        // console.log(typeLineCounter);
        // console.log('Cards: ', this.deckProcess._cardList);
        resolve(true);
      } catch (err) {
        this.deckProcess.status = 'Error';
        console.error(err);
        this.deckProcess.errorList.push(err);
        reject(new Error('Error processing TypesQtds'));
      }
    });
  }

  private processLegalities() {
    return new Promise((resolve, reject) => {
      try {
        if (this.deckProcess._deck.format) {
          this.deckProcess.status = 'Processing Legalities';
          this.deckProcess._deck.legal = true;
          const f = this.deckProcess._deck.format;
          this.deckProcess._cardList.forEach((c: Card) => {
            if (c.legalities && c.legalities[f].valueOf() !== 'legal') {
              this.deckProcess._deck.legal = false;
              this.deckProcess.errorList.push('Error of legalities of card[DeckList]: ' + c.name);
            }
          });
          this.deckProcess._sideList.forEach((c: Card) => {
            if (c.usd) {
              this.deckProcess._deck.legal = false;
              this.deckProcess.errorList.push('Error of legalities of card[SideList]: ' + c.name);
            }
          });
          resolve(true);
        } else {
          reject(new Error('Error processing Legalities'));
        }
      } catch (err) {
        this.deckProcess.status = 'Error';
        console.error(err);
        this.deckProcess.errorList.push(err);
        reject(new Error('Error processing Legalities'));
      }
    });
  }

  private processColorIdentity() {
    return new Promise((resolve, reject) => {
      try {
        if (this.deckProcess._deck && this.deckProcess._cardList.length > 0) {
          const colorIdentity = [];
          this.deckProcess._cardList.forEach((c: Card) => {
            if (c.color_identity) {
              c.color_identity.forEach((value) => {
                if (colorIdentity.indexOf(value) === -1) { colorIdentity.push(value); }
              });
            } else {
              console.error('No Identity: ', c);
            }
          });
          this.deckProcess._deckStats.colorIdentity = colorIdentity;
          this.deckProcess._deck.colorIdentity = colorIdentity;
          resolve(true);
        } else {
          reject('No deck');
          this.deckProcess.status = 'Error';
          console.error('No deck');
          this.deckProcess.errorList.push('No Deck');
        }
      } catch (err) {
        this.deckProcess.status = 'Error';
        console.error(err);
        this.deckProcess.errorList.push(err);
        reject(err);
      }
    });
  }

  public quickCreate(name?) {
    return new Promise<MoxDeck>((resolve, reject) => {
      this._auth.getUser().pipe(
        tap((user) => {
          if (user) {
            this._state.setState('loading');
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
            resolve(d);
          } else {
            console.error('User not found!: ', user);
            reject(new Error('Error creating a new deck'));
          }
        })
      ).subscribe();
    });
  }

  editDeck(d: MoxDeck) {
    // console.log(d);
    if (d) {
      this.deckProcess.active = true;
      this.deckProcess._deck = d;
      this.deckProcess._cardList = [];
      this.deckProcess._sideList = [];
      this.deckProcess.errorList = [];
      this.deckProcess.totalcards = (d.cards.length + d.side.length);
      this.getCardData();
      if (this.deckProcess._deckStats && this.deckProcess._deckStats.key !== d.key) {
        this.deckProcess._deckStats = null;
        this.getDeckStats();
      }
    }
  }

  setDeck(d: MoxDeck) {
    if (d) {
      d = this.deckFix(d);
      this._state.setState('loading');
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(d.key).set(Object.assign({}, d)).catch((error) => {
        console.error('Error adding document: ', error);
        this._state.setState('error');
        this._toast.sendMessage('Error adding document: ', 'danger', d.ownerId);
      }).then(() => {
        this._toast.sendMessage('Deck Created!', 'success', d.ownerId);
        this._state.returnState();
        // this._router.navigateByUrl('/deckhub');
      });
    }
  }

  getDeck(deckId: string): Observable<MoxDeck> {
    this.deckCollection = this.afs.collection('decks');
    return this.deckCollection.doc<MoxDeck>(deckId).valueChanges();
  }

  getCardData() {
    const deck = this.deckProcess._deck;
    const isOwner = this._user && (this.deckProcess._deck.ownerId === this._user.uid);
    if (deck) {
      if (!deck.side) { deck.side = [];  }
      Array.from(new Set(deck.cards))
      .forEach((incard) => {
        this._cardService.getCard(incard).pipe(
          tap((x: Card) => {
            this._state.setState('loading');
            if (isOwner) { this._localstorageService.updateCardStorage(x.id, x); }
            this.deckProcess._cardList.push(x);
            if (Array.from(new Set(deck.cards)).length === this.deckProcess._cardList.length) {
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
            this._state.setState('loading');
            if (isOwner) { this._localstorageService.updateCardStorage(x.id, x); }
            this.deckProcess._sideList.push(x);
            if (Array.from(new Set(deck.side)).length === this.deckProcess._sideList.length) {
              this._state.setState('nav');
              // console.log('Sort');
            }
          })
        ).subscribe();
      });
    }
  }

  viewDeck() {
    if (this.deckProcess._deck) {
      this._router.navigateByUrl('/deck/' + this.deckProcess._deck.key);
    } else {
      console.error('NO DECK');
    }
  }

  updateDeck() {
    if (this.deckProcess.active && this.deckProcess._deck) {
      this._state.setState('cloud');
      this.deckProcess.status = 'saving';
      this.afs.collection('decks')
      .doc<MoxDeck>(this.deckProcess._deck.key)
      .update(Object.assign({}, this.deckProcess._deck))
      .then(() => {
        this.deckProcess.status = 'ready';
        this._state.setState('nav');
      })
      .catch((err) => {
        this.deckProcess.errorList.push(err);
        console.error(err);
        this._state.setState('error');
      });
    } else {
      this.deckProcess.status = 'Error';
      this.deckProcess.active = false;
      console.error('Coulnd find any deck to update!');
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
    this._state.setState('cloud');
    this.afs.collection('decks').doc(deck.key).delete().then(
      () => {
        this.afs.collection('decks-stats').doc(deck.key).delete().then(
          () => {
            this._state.returnState();
            this._toast.sendMessage('Deck successfully deleted!', 'success', deck.ownerId);
          }
        ).catch(
          (err) => {
            this.deckProcess.status = 'Error';
            this.deckProcess.active = false;
            console.error(err);
            this._state.setState('error');
          }
        );
      }
    ).catch(
      (err) => {
        this.deckProcess.status = 'Error';
        this.deckProcess.active = false;
        console.error(err);
        this._state.setState('error');
      }
    );
  }

  getDeckStats() {
    if (this.deckProcess.active && this.deckProcess._deck) {
      this.afs.collection('decks-stats')
      .doc(this.deckProcess._deck.key).valueChanges()
      .pipe(
        tap((deckStats) => {
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
      this._state.setState('cloud');
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(deckId).valueChanges()
      .pipe(
        tap((tempDeck: MoxDeck) => {
          tempDeck.cards.push(cardId);
          this.deckCollection.doc(tempDeck.key).update({
            cards: tempDeck.cards
          }).then(() => {
            this._state.returnState();
            this._toast.sendMessage(
              'Done! Add to your: ' + this.deckProcess._deck.name + ' decklist.',
              'success',
              this.deckProcess._deck.ownerId);
          }).catch((err) => {
            this._state.setState('error');
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
    }
  }

  addCardSide(cardId: string, deckId?: string) {
    if (deckId) {
      this._state.setState('cloud');
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(deckId).valueChanges()
      .pipe(
        tap((tempDeck: MoxDeck) => {
          tempDeck.side.push(cardId);
          this.deckCollection.doc(tempDeck.key).update({
            side: tempDeck.side
          }).then(() => {
            this._state.returnState();
            this._toast.sendMessage(
              'Done! Add to your: ' + this.deckProcess._deck.name + ' side.',
              'success',
              this.deckProcess._deck.ownerId);
          }).catch((err) => {
            this._state.setState('error');
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
      this.deckProcess.status = 'importing';
      this.editDeck(deck);
      this.deckProcess.totalcards = 0;
      cardList.valueOf().split('\n').forEach(async elt => {
        if (elt && elt.length > 0) {
          const qnt = +elt.substr(0, 2);
          const cardname = elt.substr(2, elt.length);
          // console.log('Qntd: ', qnt);
          // console.log('Name: ', cardname);
          this.deckProcess.totalcards = this.deckProcess.totalcards + qnt;
          for (let index = 1; index <= qnt; index++) {
            if (this.deckProcess._deck.cards.length >= 60) {
              this._scryService.fuzzySearch(cardname).pipe(
                tap((c: Card) => {
                  this.deckProcess._deck.cards.push(c.id);
                  if (this.deckProcess.totalcards === (this.deckProcess._deck.cards.length + this.deckProcess._deck.side.length)) {
                    this.updateDeck();
                    res(true);
                  }
                })
              ).subscribe();
            } else {
              this._scryService.fuzzySearch(cardname).pipe(
                tap((c: Card) => {
                  this.deckProcess._deck.cards.push(c.id);
                  if (this.deckProcess.totalcards === (this.deckProcess._deck.cards.length + this.deckProcess._deck.side.length)) {
                    this.updateDeck();
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

  public sortAlphaUp () {
    this.deckProcess._cardList = this.deckProcess._cardList.sort((a: Card, b: Card) => {
      if ( a.name < b.name ) { return -1; }
      if ( a.name > b.name ) { return 1; }
      return 0;
    });
  }

  public sortAlphaDown () {
    this.deckProcess._cardList = this.deckProcess._cardList.sort((a: Card, b: Card) => {
      if ( a.name > b.name ) { return -1; }
      if ( a.name < b.name ) { return 1; }
      return 0;
    });
  }

  public sortCmcUp () {
    this.deckProcess._cardList = this.deckProcess._cardList.sort((a: Card, b: Card) => {
      if ( Number(a.cmc) < Number(b.cmc) ) { return -1; }
      if ( Number(a.cmc) > Number(b.cmc) ) { return 1; }
      return 0;
    });
  }

  public sortCmcDown () {
    this.deckProcess._cardList = this.deckProcess._cardList.sort((a: Card, b: Card) => {
      if ( Number(a.cmc) > Number(b.cmc) ) { return -1; }
      if ( Number(a.cmc) < Number(b.cmc) ) { return 1; }
      return 0;
    });
  }

  public sortPriceUp () {
    this.deckProcess._cardList = this.deckProcess._cardList.sort((a: Card, b: Card) => {
      if ( Number(a.usd) < Number(b.usd) ) { return -1; }
      if ( Number(a.usd) > Number(b.usd) ) { return 1; }
      return 0;
    });
  }

  public sortPriceDown () {
    this.deckProcess._cardList = this.deckProcess._cardList.sort((a: Card, b: Card) => {
      if ( Number(a.usd) > Number(b.usd) ) { return -1; }
      if ( Number(a.usd) < Number(b.usd) ) { return 1; }
      return 0;
    });
  }

  public sortTypeUp () {
    this.deckProcess._cardList = this.deckProcess._cardList.sort((a: Card, b: Card) => {
      if ( a.type_line < b.type_line ) { return -1; }
      if ( a.type_line > b.type_line ) { return 1; }
      return 0;
    });
  }

  public sortTypeDown () {
    this.deckProcess._cardList = this.deckProcess._cardList.sort((a: Card, b: Card) => {
      if ( a.type_line > b.type_line ) { return -1; }
      if ( a.type_line < b.type_line ) { return 1; }
      return 0;
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

  private countTypes(param: string): number {
    return this.deckProcess._cardList
    .filter((card: Card) => {
      if (card.card_faces) {
        return card.card_faces[0].type_line.toLowerCase().trim().includes(param);
      } else {
        return card.type_line.toLowerCase().trim().includes(param);
      }
    }).length;
  }

  countOccurrences(arr: string[], value: string) {
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
