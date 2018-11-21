import { Card, Catalog } from '@application/_models/_scryfall-models/models';
import { AuthService } from '@karn/_services/auth.service';
import { MetaService } from 'ng2-meta';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MoxCollection } from '@application/_models/_mox-models/MoxCollection';
import { MoxCollectionService } from '@application/_services/mox-services/collection/mox-collection.service';
import { tap } from 'rxjs/operators';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { PickerComponent } from '@shared/ui/picker/picker.component';

@Component({
  selector: 'app-mox-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.sass']
})
export class CollectionViewComponent implements OnInit {
  @ViewChild('deckPiker') deckPiker: PickerComponent;
  public _collection: Observable<MoxCollection>;
  public _selectedCard: Card;
  public _cardPicked;
  public tab = 0;
  public cardView = false;
  public side = false;
  public cardSearchActive = false;
  public searchResults: Observable<Catalog>;
  public stateCtrl = new FormControl();
  public searchParam;
  constructor(
    public _afs: AngularFirestore,
    public  _auth: AuthService,
    public _route: ActivatedRoute,
    public _toast: ToastService,
    public _router: Router,
    public _colleServ: MoxCollectionService,
    public _searcServ: ScryfallSearchService,
    private _state: ActionStateService,
    private _metaService: MetaService,
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      const deckId = params['id'];
      if (!deckId) {
        this._toast.sendMessage('Not founded DeckID, maybe he got deleted?', 'danger', deckId);
        throw new Error('Not founded DeckID');
      } else {
        this._collection = this._colleServ.get(deckId);
        this._collection.pipe(tap(
          (dck: MoxCollection) => {
            if (dck) {
              this._metaService.setTitle('[Mox]Collection - ' + dck.name);
              this._metaService.setTag('og:image', dck.cover);
              this._colleServ.edit(dck, this._colleServ._collProcess).then(
                () => {
                  this._state.setState('nav');
                }
              );
            }
          }
        )).subscribe();
      }
    });
  }

  saveCollection() {
    this._state.setState('cloud');
    this._colleServ.update(this._colleServ._collProcess)
    .then(
      (dp) => {
        this._state.setState('nav');
      }
    ).catch(
      (err) => {
        console.error(err);
      }
    );
  }

  activateSearch() {
    this.cardSearchActive = true;
    this.stateCtrl.valueChanges
      .pipe(
        tap((value: string) => {
          if (value.length >= 3) {
            this.searchResults = this._searcServ.autoSearch(value);
          }
        }
      )).subscribe();
  }

  searchSelect(param) {
    const selectedValue = param.option.value;
    const coSrvc = this._colleServ;
    this._state.setState('loading');
    this._searcServ.fuzzySearch(selectedValue).pipe(
      tap((c: Card) => {
          const dl = (coSrvc._collProcess.collection.cards)
            ? coSrvc._collProcess.collection.cards.reverse() : coSrvc._collProcess.collection.cards = [];
          dl.push(c.id);
          dl.reverse();
          coSrvc.update(coSrvc._collProcess)
          .then(dp => coSrvc.edit(dp.collection, coSrvc._collProcess))
          .then(() => {
              this._state.setState('nav');
            }
          ).catch(
            (err) => {
              console.error(err);
              this._state.setState('error');
            }
          );
        }
      ),
    ).subscribe();
  }

  activateCardView() {
    this.cardView = true;
  }

  setCover(param) {
    navigator.vibrate([30]);
    this._colleServ._collProcess.status = 'Updating Cover';
    const fbCollec = this._afs.collection('user-collections');
    fbCollec.doc(this._colleServ._collProcess.collection.key).update({
      cover: param
    }).then(
      () => {
        this._toast.sendMessage(`Success! Collectio Cover Updated!`, 'success', this._colleServ._collProcess.collection.ownerId);
        this._colleServ._collProcess.status = 'Complete';
        this._state.setState('nav');
      }
    );
  }

  selectedCard(card: Card) {
    if (this._selectedCard === card) {
      this._selectedCard = null;
      this.side = false;
    } else {
      navigator.vibrate([30]);
      this._selectedCard = card;
    }
  }

  cardPlus(event) {
    navigator.vibrate([30]);
    this._colleServ._collProcess.collection.cards.push(event);
    this.saveCollection();
  }

  cardMinus(event) {
    navigator.vibrate([30]);
    const coll = this._colleServ._collProcess.collection;
    coll.cards.splice(coll.cards.indexOf(event), 1);
    if (!coll.cards.includes(event)) {
      this._selectedCard = null;
    }
    this.saveCollection();
  }

  activateDeckPicker(param) {
    this._cardPicked = param;
    this.deckPiker.activatePicker();
  }

  filteredCardList() {
    return this._colleServ._collProcess.cardList;
  }

  isOwner(user) {
    return (user.uid === this._colleServ._collProcess.collection.ownerId);
  }

  isCardSelected(): boolean {
    return (this._selectedCard !== null);
  }

  cardAmount(cardId) {
    return this._colleServ.statTools.countOccurrences(this._colleServ._collProcess.collection.cards, cardId);
  }

  getCardImgUri() {
    if (this._selectedCard && this._selectedCard.image_uris) {
      return this._selectedCard.image_uris.normal;
    } else {
      return this._selectedCard.card_faces[0].image_uris.normal;
    }
  }

  getCardBackImgUri() {
    if (this._selectedCard && this._selectedCard.image_uris) {
      return './../../../assets/card_back.jpg';
    } else {
      return this._selectedCard.card_faces[1].image_uris.normal;
    }
  }
}
