import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '@karn/_services/auth.service';
import { tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { ToastService } from '@application/_services/toast/toast.service';

@Component({
  selector: 'app-mox-deck-picker',
  templateUrl: './deck-picker.component.html',
  styleUrls: ['./deck-picker.component.sass']
})
export class DeckPickerComponent implements OnInit {
  _userDecks: MoxDeck[];
  _side = false;
  @Input() card: string;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public _deckSelection: string;
  constructor(
    public _auth: AuthService,
    public _afs: AngularFirestore,
    public _dkServ: MoxDeckService,
    private _state: ActionStateService,
    public _toast: ToastService,
  ) { }

  ngOnInit() {
    this._auth.getUser().pipe(tap(
      (user) => {
        if (user) {
          const fbDeckColl = this._afs.collection('decks', ref => ref.where('ownerId', '==', user.uid));
          fbDeckColl.valueChanges().pipe(tap(
            (docL) => {
              this._userDecks = <MoxDeck[]>docL.sort((a: MoxDeck, b: MoxDeck) => {
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

  addOne() {
    const add = (!this._side) ?
    this._dkServ.addCard(this.card, this._deckSelection) : this._dkServ.addCardSide(this.card, this._deckSelection);
    add.then(
      (dp) => {
        this._afs.collection('decks').doc(dp._deck.key).update({
          cards: dp._deck.cards
        }).then(() => {
          this._toast.sendMessage('Done! Add to your: ' + dp._deck.name + ' decklist.', 'success', dp._deck.ownerId);
          this._state.setState('nav');
        }).catch((err) => {
          this._toast.sendMessage('Error! ' + err, 'error', dp._deck.ownerId);
          this._state.setState('error');
        });
      }
    );
  }

}
