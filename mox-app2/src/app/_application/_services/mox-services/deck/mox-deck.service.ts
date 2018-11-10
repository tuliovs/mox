import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Card } from '@application/_models/_scryfall-models/models';
import { MoxDeck, DeckProcess, DeckStatistics } from '@application/_models/_mox-models/MoxDeck';
import { AuthService } from '@karn/_services/auth.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';
import { CardListSort } from '@application/_utils/sorts';
import { DeckStats } from '@application/_utils/stats';
import { DeckIO } from '@application/_utils/io';

@Injectable({
  providedIn: 'root'
})
export class MoxDeckService {
  private deckCollection: AngularFirestoreCollection<MoxDeck>;
  private workingDeck = new Subject<MoxDeck>();
  private creatingDeck = new Observable<MoxDeck>();
  public deckProcess = new DeckProcess();
  public sortTools = CardListSort;
  public statTools = DeckStats;
  public ioTools;
  public _user;
  constructor (
    private afs: AngularFirestore,
    private _auth: AuthService,
    private _state: ActionStateService,
    private _localstorageService: LocalstorageService,
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

  quickCreate(name?: string) {
    return new Promise<MoxDeck>((resolve, reject) => {
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
            this.deckProcess._deck = d;
            resolve(d);
          } else {
            console.error('#333 [quickCreate] User not found!: ', user);
            reject(new Error('Error creating a new deck'));
          }
        })
      ).subscribe();
    });
  }

  forkDeck() {
    return new Promise<MoxDeck>((resolve, reject) => {
      try {
        if (this._user) {
          const forked = new MoxDeck();
          const deck = this.deckProcess._deck;
          forked.cards = deck.cards;
          forked.side = deck.side;
          forked.colorIdentity = deck.colorIdentity;
          forked.format = deck.format;
          forked.cover = deck.cover;
          forked.name = deck.name;
          forked.public = true;
          forked.originayKey = (deck.originayKey ? deck.originayKey : deck.key);
          forked.creatorId = (deck.creatorId ? deck.creatorId : deck.ownerId);
          forked.ownerName = this._user.displayName;
          forked.ownerId = this._user.uid;
          forked.key = this.makeId();
          this.setDeck(forked)
          .then(() => {
            this._toast.sendMessage('Deck Forked!', 'success', forked.ownerId);
            this._state.returnState();
            resolve(forked);
          })
          .catch((err) => {
            console.error(err);
          });
        } else {
          console.error('#333 [forkDeck] User not found!');
          reject ('ERROR! User not found! I`m lost help!');
        }
      } catch (err) {
        reject (err);
      }
    });
  }

  editDeck(deck: MoxDeck) {
    return new Promise<DeckProcess>((resolve, reject) => {
      if (deck) {
        const pro = this.deckProcess;
        pro.active = true;
        pro._deck = deck;
        pro._cardList = [];
        pro._sideList = [];
        pro.errorList = [];
        pro.totalcards = (deck.cards.length + deck.side.length);
        this.getCardData(pro)
        .then(pp => this.getDeckStats(pp))
        .then(dP => resolve(dP))
        .catch(
          (err) => {
            console.error(`#765 [EditDeck] - ${err}`);
          }
        );
      } else {
        reject('Error! No Deck founded!');
      }
    });
  }

  setDeck(deck: MoxDeck) {
    return new Promise<DeckProcess>((resolve, reject) => {
      if (deck) {
        this.deckCollection = this.afs.collection('decks');
        this.deckCollection.doc(deck.key).set(Object.assign({}, deck))
        .catch((err) => {
          console.error('Error adding document: ', err);
          this._toast.sendMessage('Error adding document: ' + err, 'danger', deck.ownerId);
          reject (err);
        }).then(() => {
          this.deckProcess._deck = deck;
          resolve(this.deckProcess);
        });
      } else {
        reject ('NOT A VALID DECK!');
      }
    });
  }

  getDeck(deckId: string): Observable<MoxDeck> {
    this.deckCollection = this.afs.collection('decks');
    return this.deckCollection.doc<MoxDeck>(deckId).valueChanges();
  }

  getCardData(deckProcess: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      if (!deckProcess) {
        reject('#235 [GetCardData] - No Deck Process');
      } else {
        const deck = deckProcess._deck;
        const isOwner = this._user && (this.deckProcess._deck.ownerId === this._user.uid);
        Array.from(new Set(deck.cards))
        .forEach((incard) => {
          this._cardService.getCard(incard).then((obs) => {
            obs.pipe(
              tap((x: Card) => {
                if (x) {
                  this._state.setState('loading');
                  if (isOwner) { this._localstorageService.updateCardStorage(x.id, x); }
                  this.deckProcess._cardList.push(x);
                  if (Array.from(new Set(deck.cards)).length === this.deckProcess._cardList.length) {
                    this._state.returnState();
                  }
                }   else {
                  console.log('#135 Error');
                  reject('#135 [GetCardData] - Error');
                }
              }),
            ).subscribe();
          });
        });

        Array.from(new Set(deck.side))
        .forEach((incard) => {
          this._cardService.getCard(incard).then((obs) => {
            obs.pipe(
              tap((x: Card) => {
                if (x) {
                  this._state.setState('loading');
                  if (isOwner) { this._localstorageService.updateCardStorage(x.id, x); }
                  this.deckProcess._sideList.push(x);
                  if (Array.from(new Set(deck.side)).length === this.deckProcess._sideList.length) {
                    this._state.returnState();
                  }
                } else {
                  console.log('#135 Error');
                  reject('#135 [GetCardData] -  Error');
                }
              })
            ).subscribe();
          });
        });

        resolve(deckProcess);
      }
    });
  }

  viewDeck() {
    if (this.deckProcess._deck) {
      this._router.navigateByUrl('/deck/' + this.deckProcess._deck.key);
    } else {
      console.error('#233 [ViewDeck] No Deck');
    }
  }

  updateDeck(dkPs: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      if (dkPs._deck) {
        dkPs.status = 'Updating Deck';
        this.afs.collection('decks')
        .doc<MoxDeck>(dkPs._deck.key)
        .update(Object.assign({}, dkPs._deck))
        .then(() => {
          dkPs.status = 'updated';
          resolve (dkPs);
        })
        .catch((err) => {
          dkPs.errorList.push(err);
          console.error(err);
          reject (err);
        });
      } else {
        dkPs.status = 'Error';
        dkPs.active = false;
        console.error('#234 [updateDeck] Coulnd find any deck to update!');
        reject ('#234 [updateDeck] Coulnd find any deck to update!');
      }
    });
  }

  deleteDeck(deck: MoxDeck) {
    return new Promise<Boolean>((resolve, reject) => {
      if (!deck) {
        reject(false);
      } else {
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
                resolve(true);
              }
            ).catch(
              (err) => {
                this.deckProcess.status = 'Error';
                this.deckProcess.active = false;
                this.deckProcess.errorList.push(err);
                this._state.setState('error');
                reject(err);
              }
            );
          }
        ).catch(
          (err) => {
            this.deckProcess.status = 'Error';
            this.deckProcess.active = false;
            this.deckProcess.errorList.push(err);
            this._state.setState('error');
            reject(err);
          }
        );
      }
    });
  }

  getDeckStats(deckProcess: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      if (!deckProcess) {
        reject('#563 [getDeckStats] No deck process');
      } else {
        if (this.deckProcess._deck) {
          this.afs.collection('decks-stats')
          .doc(this.deckProcess._deck.key).valueChanges()
          .pipe(
            tap((deckStats: DeckStatistics) => {
              this.deckProcess._deckStats = deckStats;
              resolve(this.deckProcess);
            })
          ).subscribe();
        } else {
          console.error('#564 [getDeckStats] No deck in process');
          reject('#564 [getDeckStats] No deck in process');
        }
      }
    });
  }

  setDeckStats(deckP: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      if (deckP) {
        this.deckCollection = this.afs.collection('decks-stats');
        this.deckCollection.doc(deckP._deckStats.key).set(Object.assign({}, deckP._deckStats))
        .catch((error) => {
          this.deckProcess.errorList.push(error);
          reject(`#111 [SaveDeckStats] - Error adding document: ${error}`);
        }).then(
          () => {
            resolve(deckP);
          }
        );
      } else {
        reject('#343 [setDeckStats] - no process');
      }
    });
  }

  updateDeckStats(dkPs: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      if (dkPs._deckStats) {
        dkPs.status = 'Updating Deck Stats';
        this.afs.collection('decks-stats')
        .doc<DeckStatistics>(dkPs._deckStats.key)
        .update(Object.assign({}, dkPs._deckStats))
        .then(() => {
          dkPs.status = 'ready';
          dkPs.active = false;
          resolve (dkPs);
        })
        .catch((err) => {
          dkPs.errorList.push(err);
          dkPs.active = false;
          console.error(err);
          reject (err);
        });
      } else {
        dkPs.status = 'Error';
        dkPs.active = false;
        console.error('#234 [updateDeck] Coulnd find any deck to update!');
        reject ('#234 [updateDeck] Coulnd find any deck to update!');
      }
    });
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

  makeId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}
