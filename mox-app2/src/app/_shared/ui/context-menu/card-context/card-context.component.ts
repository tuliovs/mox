import { Input, Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { MoxDeck } from '@application/_models/_mox_models/MoxDeck';
import { Card } from '@application/_models/_scryfall-models/models';
import { tap } from 'rxjs/operators';
import { AuthService } from '@karn/_services/auth.service';

@Component({
  selector: 'app-mox-card-context',
  templateUrl: './card-context.component.html',
  styleUrls: ['./card-context.component.sass'],
  animations: [
    trigger('card-contextTrigger', [
      state('closed', style({
        transform: 'translate3d(0,100%, 0)',
        display: 'none'
      })),
      state('opened', style({
        transform: 'translate3d(0, 0, 0)',
        display: 'visible'
      })),
      transition('closed=>opened', animate('200ms')),
      transition('opened=>closed', animate('150ms'))
    ])
  ]
})
export class CardContextComponent implements OnInit, AfterViewInit {

  public deckCollection: AngularFirestoreCollection <MoxDeck>;
  public _Deck: MoxDeck;
  get cardCount(): number {
    const t = this._deckService.deckProcess._deck.cards.filter((n) => n = this.card.id );
    return t.length;
  }
  get sideCount(): number {
    if (!this._deckService.deckProcess._deck.side) {
      this._deckService.deckProcess._deck.side = [];
    }
    const t = this._deckService.deckProcess._deck.side.filter((n) => n = this.card.id );
    return t.length;
  }
  constructor(
    public _router: Router,
    public afs: AngularFirestore,
    public _auth: AuthService,
    public _deckService: MoxDeckService,
    public _state: ActionStateService,
    public _toast: ToastService
  ) {}
  @Input() card: Card;
  @Input() icon;
  @Input() disabled;
  public componentState = 'closed';
  public lightboxActive = false;
  ngOnInit() {}

  ngAfterViewInit() {
    this._deckService.getWorkingDeck().pipe(
      tap((deck) => {
        this._Deck = deck;
      })
    ).subscribe();
  }

  addOneCard(side?: boolean) {
    if (!side) {
      this._deckService.addCard(this.card.id);
    } else {
      this._deckService.addCardSide(this.card.id);
    }
    this.closeContext();
  }

  addFourCard(side?: boolean) {
    alert('Not Implemented!');
  }

  setCover() {
    if (this._deckService.deckProcess._deck) {
      this._deckService.deckProcess.active = true;
      this.deckCollection = this.afs.collection('decks');
      this.deckCollection.doc(this._deckService.deckProcess._deck.key).update({
        cover: this.card.image_uris.art_crop
      }).then(
        () => {
          this._toast.sendMessage(
            'Congrats! ' + this.card.name + ' set as DeckCover for ' + this._deckService.deckProcess._deck.name + ' !',
            'success',
            this._deckService.deckProcess._deck.ownerId);
          this._deckService.deckProcess.active = false;
          this.closeContext();
          this._state.returnState();
        }
      );
    }
    this.closeContext();
  }

  activateContext() {
    this.lightboxActive = true;
    this.componentState = 'opened';
    this._state.setState('hidden');
  }

  closeContext() {
    this.lightboxActive = false;
    this.componentState = 'closed';
    this._state.returnState();
  }

  viewCard() {
    this._router.navigate(['/card/' + this.card.id]);
  }
}
