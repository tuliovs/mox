import { AuthService } from '@karn/_services/auth.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MoxCollection } from '@application/_models/_mox-models/MoxCollection';
import { CollectionProcess } from '@application/_models/_mox-models/MoxCollection';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { MoxCollectionService } from '@application/_services/mox-services/collection/mox-collection.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-mox-collection-picker',
  templateUrl: './collection-picker.component.html',
  styleUrls: ['./collection-picker.component.sass']
})
export class CollectionPickerComponent implements OnInit {
  _userColls: MoxCollection[];
  @Input() deckId: string;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public _collSelection: MoxCollection;
  constructor(
    public _auth: AuthService,
    public _afs: AngularFirestore,
    public _dkServ: MoxDeckService,
    public _clServ: MoxCollectionService,
    public _state: ActionStateService,
    public _toast: ToastService
  ) { }

  ngOnInit() {
    this._auth.getUser().pipe(tap(
      (user) => {
        if (user) {
          const fbDeckColl = this._afs.collection('user-collections', ref => ref.where('ownerId', '==', user.uid));
          fbDeckColl.valueChanges().pipe(tap(
            (docL) => {
              this._userColls = <MoxCollection[]>docL.sort((a: MoxCollection, b: MoxCollection) => {
                if (a.name < b.name) {
                  return -1;
                } else if (a.name > b.name) {
                  return 1;
                } else {
                  return 0;
                }
              });
            }
          )).subscribe();
        }
    })).subscribe();
  }

  addAll() {
    const dkS = this._dkServ;
    const clS = this._clServ;
    const coll = this._collSelection;
    coll.cards = coll.cards.concat(dkS.deckProcess._deck.cards);
    clS.edit(coll, this._clServ._collProcess)
    .then(cp => clS.update(cp))
    .then(up => clS.getCardData(up))
    .then(
      (pro: CollectionProcess) => {
        this._state.setState('nav');
        this._toast
          .sendMessage(`Done! Add all cards of this deck to your: ${pro.collection.name} collection.`, 'success', pro.collection.ownerId);
      }
    ).catch((err) => {
      this._toast.sendMessage('Error! ' + err, 'error', coll.ownerId);
      this._state.setState('error');
    });
  }

}
