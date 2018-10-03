import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';
import { Injectable } from '@angular/core';
import { Card } from '@application/_models/_scryfall-models/models';
import { AngularFirestore } from '@angular/fire/firestore';
import { ScryfallCardService } from '@application/_services/scryfall-services/card/scryfall-card.service';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { FavoriteCards } from '@application/_models/_mox-models/Favorites';
import { AuthService } from '@karn/_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MoxFavoriteService {
  public _userFavorites: Observable<FavoriteCards>;
  private _user;
  constructor (
    public _afs: AngularFirestore,
    private _auth: AuthService,
    public _scryfallService: ScryfallCardService,
    public _localstorageService: LocalstorageService
    ) {
      this._auth.getUser().pipe(
        tap((user) => {
          if (user) {
            this._user = user;
            this._userFavorites = this._afs.collection('favorite-cards')
              .doc(user.uid).valueChanges().pipe(
                switchMap (favs => {
                  if (favs) {
                    return this._afs.collection('favorite-cards').doc<FavoriteCards>(user.uid).valueChanges();
                  } else {
                    return of(null);
                  }
                })
              );
          }
        })
      ).subscribe();
  }

  public favoriteCard(card: Card) {
    return new Promise<any>((resolve, rej) => {
      let res;
      const storage = this._localstorageService;
      if (storage.favsStorage.has('cards')) {
        const favList = <FavoriteCards>storage.favsStorage.get('cards');
        const actualFav = favList.actualFavs;
        if (actualFav.indexOf(card.id, 0) > 0) {
          actualFav.splice(actualFav.indexOf(card.id), 1);
          storage.updateFavStorage(favList);
          res = false;
        } else {
          actualFav.push(card.id.trim().toLowerCase());
          storage.updateFavStorage(favList);
          res = true;
        }
        this._afs.collection('favorite-cards').doc(this._user.uid)
        .update(favList).catch((err) => {
          rej(err);
        }).then(() => {
          resolve(res);
        });
      } else {
        console.log('No CardLists');
        const newFav = new FavoriteCards();
        newFav.actualFavs = [];
        newFav.actualFavs.push(card.id);
        this._afs.collection('favorite-cards').doc(this._user.uid)
        .set(Object.assign({}, newFav)).catch((err) => {
          rej(err);
        }).then(() => {
          storage.updateFavStorage(newFav);
        });
      }
      resolve(res);
    });
  }

  // public getMyCardFavs(userId): Observable<FavoriteCards> {
  //   this._afs.collection('favorite-cards').doc(userId).ref.get().then(
  //     (doc) => {
  //       if (doc.exists) {
  //         console.log('Doc exists!');
  //         return this._afs.collection('favorite-cards').doc<FavoriteCards>(userId).valueChanges();
  //       } else {
  //         console.log('Doc dont exists!');
  //         this.setUserFavs(userId).then((favList) => {
  //           this._userFavorites = favList;
  //           return of(this._userFavorites);
  //         }).catch((err) => {
  //           console.error(err);
  //         });
  //       }
  //     }
  //   );
  //   return;
  // }

  public isFav(cardId) {
    if (!this._userFavorites) {
      return false;
    } else {
      const lsS = this._localstorageService;
      if (lsS.favsStorage.has('cards')) {
        const favList = <FavoriteCards>lsS.favsStorage.get('cards');
        if (favList) {
          // console.log('isFav ', { cardId, favList, isFav: favList.actualFavs.indexOf(cardId.trim().toLowerCase()) });
          const res = (favList.actualFavs.indexOf(cardId.trim().toLowerCase()) >= 0);
          return res;
        } else {
          console.error('not a list');
          return false;
        }
      } else {
        console.error('no-cards');
        return false;
      }
    }
  }

  // private setUserFavs(userId) {
  //   return new Promise<FavoriteCards>( async (resolve, rej) => {
  //     this._userFavorites = new FavoriteCards();
  //     this._afs.collection('favorite-cards').doc(this._user.uid)
  //     .set(this._userFavorites).catch((err) => {
  //       console.error(err);
  //       rej(err);
  //     }).then(() => {
  //       console.log('pock!');
  //       resolve(this._userFavorites);
  //     });
  //   });
  // }
}

