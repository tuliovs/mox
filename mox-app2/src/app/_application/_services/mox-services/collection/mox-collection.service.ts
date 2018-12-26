import { Injectable } from '@angular/core';
import { MoxCollection, CollectionProcess } from '@application/_models/_mox-models/MoxCollection';
import { tap } from 'rxjs/operators';
import { User } from 'firebase';
import { AuthService } from '@karn/_services/auth.service';
import { Card } from '@application/_models/_scryfall-models/models';
import { MoxCardService } from '../card/mox-card.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastService } from '@application/_services/toast/toast.service';
import { Observable } from 'rxjs';
import { CollectionStats } from '@application/_utils/stats';

@Injectable({
  providedIn: 'root'
})

export class MoxCollectionService {
  public _user: User;
  public _collProcess = new CollectionProcess();
  public statTools = CollectionStats;
  constructor (
    private _afs: AngularFirestore,
    public _auth: AuthService,
    public _toast: ToastService,
    public _cardService: MoxCardService,
    private _localstorageService: LocalstorageService,
    private _state: ActionStateService,
  ) {
    this._auth.getUser().pipe(
      tap((user: User) => {
        this._user = user;
      })
    ).subscribe();
  }

  create(base?: MoxCollection ) {
    return new Promise<CollectionProcess>((resolve, reject) => {
      const seed = (base) ? { ...base } : new MoxCollection();
      const pro = this._collProcess;
      seed.key = this.makeId();
      seed.created = new Date();
      if (this._user) {
        seed.ownerId = this._user.uid;
        seed.ownerName = this._user.displayName;
        pro.collection = seed;
        resolve(pro);
      } else {
        reject('Error - No user found');
      }
    });
  }

  edit(coll: MoxCollection, pro: CollectionProcess) {
    return new Promise<CollectionProcess>((resolve, reject) => {
      if (pro) {
        pro.collection = coll;
        pro.cardList = [];
        pro.errorList = [];
        pro.totalcards = (coll.cards) ? coll.cards.length : 0;
        this.getCardData(pro)
        .then(dP => resolve(dP))
        .catch(
          (err) => {
            console.error(`#765 [EditCollection] - ${err}`);
          }
        );
      } else {
        reject('Error! No Collection founded!');
      }
    });
  }

  set(pro: CollectionProcess) {
    return new Promise<CollectionProcess>((resolve, reject) => {
      if (pro.collection) {
        const afs = this._afs.collection('user-collections');
        afs.doc(pro.collection.key).set(Object.assign({}, pro.collection))
        .catch((err) => {
          console.error('Error adding document: ', err);
          reject (err);
        }).then(() => {
          resolve(pro);
        });
      } else {
        reject ('#135 [Error] - Invalid Collection to Set.');
      }
    });
  }

  get(collectionId: string): Observable<MoxCollection> {
    return this._afs.collection('user-collections').
      doc<MoxCollection>(collectionId).valueChanges();
  }

  fork(pro: CollectionProcess) {
    return new Promise<CollectionProcess>((resolve, reject) => {
      if (pro.collection) {
        if (this._user) {
          const forked = { ...pro.collection };
          forked.ownerName = this._user.displayName;
          forked.ownerId = this._user.uid;
          forked.key = this.makeId();
          pro.collection = forked;
          this.set(pro)
          .then(() => {
            this._toast.sendMessage('Collection Forked!', 'success', forked.ownerId);
            this._state.returnState();
            resolve(pro);
          })
          .catch((err) => {
            console.error(err);
          });
        } else {
          console.error('#333 [forkCollection] User not found!');
          reject ('ERROR! User not found! I`m lost help!');
        }
      } else {
        pro.status = 'Error';
        console.error('#234 [updateCollection] Coulnd find any Collection to update!');
        reject ('#234 [updateCollection] Coulnd find any Collection to update!');
      }
    });
  }

  update(pro: CollectionProcess) {
    return new Promise<CollectionProcess>((resolve, reject) => {
      if (pro.collection) {
        pro.status = 'Updating Collection';
        this._afs.collection('user-collections')
        .doc<MoxCollection>(pro.collection.key)
        .update(Object.assign({}, pro.collection))
        .then(() => {
          pro.status = 'updated';
          resolve (pro);
        })
        .catch((err) => {
          pro.errorList.push(err);
          console.error(err);
          reject (err);
        });
      } else {
        pro.status = 'Error';
        console.error('#234 [updateDeck] Coulnd find any deck to update!');
        reject ('#234 [updateDeck] Coulnd find any deck to update!');
      }
    });
  }

  delete(pro: CollectionProcess) {
    return new Promise<Boolean>((resolve, reject) => {
      if (!pro.collection) {
        reject(false);
      } else {
        pro.status = 'Deleting Collection';
        pro.collection = null;
        pro.cardList = null;
        this._state.setState('cloud');
        this._afs.collection('user-collections').doc(pro.collection.key).delete().then(
          () => {
            this._state.returnState();
            this._toast.sendMessage('Collection successfully deleted!', 'success', pro.collection.ownerId);
            resolve(true);
          }
        ).catch(
          (err) => {
            pro.status = 'Error';
            pro.errorList.push(err);
            this._state.setState('error');
            reject(err);
          }
        );
      }
    });
  }

  getCardData(pro: CollectionProcess) {
    return new Promise<CollectionProcess>((resolve, reject) => {
      if (!pro) {
        reject('#235 [GetCardData] - No Collection Process');
      } else {
        const coll = pro.collection;
        const isOwner = this._user && (pro.collection.ownerId === this._user.uid);
        Array.from(new Set(coll.cards))
        .forEach((incard) => {
          this._cardService.getCard(incard).then((obs) => {
            obs.pipe(
              tap((x: Card) => {
                if (x) {
                  this._state.setState('loading');
                  if (isOwner) { this._localstorageService.updateCardStorage(x.id, x); }
                  pro.cardList.push(x);
                  if (Array.from(new Set(coll.cards)).length === pro.cardList.length) {
                    this._state.returnState();
                  }
                } else {
                  console.log('#135 Error');
                  reject('#135 [GetCardData] - Error');
                }
              }),
            ).subscribe();
          });
        });
        resolve(pro);
      }
    });
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
