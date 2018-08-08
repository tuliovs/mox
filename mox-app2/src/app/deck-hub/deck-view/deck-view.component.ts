import { ToastService } from './../../_application/_services/toast/toast.service';
import { Observable } from 'rxjs';
import { MoxDeck } from 'src/app/_application/_models/_mox_models/MoxDeck';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { tap } from 'rxjs/operators';
import { ActionStateService } from '@application/_services/action-state/action-state.service';

@Component({
  selector: 'app-mox-deck-view',
  templateUrl: './deck-view.component.html',
  styleUrls: ['./deck-view.component.sass']
})

export class DeckViewComponent implements OnInit {
  public formats = [
    '1v1',
    'brawl',
    'commander',
    'duek',
    'frontier',
    'future',
    'legacy',
    'modern',
    'pauper',
    'penny',
    'standard',
    'vintage'
  ];

  public _deck: Observable<MoxDeck>;
  public _selectedCard;
  public tempDeck: MoxDeck;
  public tab = 'profileTab';
  public _id: string;
  public _cardList: any;
  public _sideList: any;
  public _rawCardList: any;
  public _rawSideList: any;
  public deckCollection: AngularFirestoreCollection<MoxDeck>;
  public width;
  @ViewChild('invisibleText') invTextER: ElementRef;
  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private toast: ToastService,
    private router: Router,
    private state: ActionStateService
  ) { }

  resizeInput(inputText) {
    setTimeout ( () => {
      const minWidth = 64;
      if (this.invTextER.nativeElement.offsetWidth > minWidth) {
        this.width = this.invTextER.nativeElement.offsetWidth + 2;
      } else {
        // this.width = minWidth;
      }
    }, 0);
  }

  ngOnInit() {
    this.route.params.subscribe( params => {
      const id = params['id'];
      if (!id) {
        this.toast.sendMessage('Not founded DeckID, maybe he got deleted?', 'danger', id);
        throw new Error('Not founded DeckID');
      } else {
        this._id = id;
        this.deckCollection = this.afs.collection('decks');
        this._deck = this.deckCollection.doc<MoxDeck>(id).valueChanges();
        this._deck.pipe(
          tap( (deck) => {
            if (!deck.side) { deck.side = [];  }
            this.tempDeck = deck;
            deck.cards.forEach((incard) => {
              console.log(incard);
            });
            this._rawCardList = deck.cards;
            this._rawSideList = deck.side;
            this._cardList = Array.from(new Set(deck.cards));
            this._sideList = Array.from(new Set(deck.side));
            // console.log('#', this.tempDeck);
          })
        ).subscribe();
      }
    });
  }
  saveDeck(silent?: boolean) {
    this.state.setState('cloud');
    this.deckCollection = this.afs.collection('decks');
    this.deckCollection.doc<MoxDeck>(this._id).update(this.tempDeck).then(
      () => {
        this.state.setState('nav');
      }
    );
  }
  cardAmount(cardId) {
    return this.countOccurrences(this._rawCardList, cardId);
  }

  cardSideAmount(cardId) {
    return this.countOccurrences(this._rawSideList, cardId);
  }

  cardPlus(event) {
    this.tempDeck.cards.push(event);
    this.saveDeck(true);
  }
  cardSidePlus(event) {
    this.tempDeck.side.push(event);
    this.saveDeck(true);
  }

  cardMinus(event) {
    this.tempDeck.cards.splice(this.tempDeck.cards.indexOf(event), 1);
    this.saveDeck(true);
  }
  cardSideMinus(event) {
    this.tempDeck.side.splice(this.tempDeck.side.indexOf(event), 1);
    this.saveDeck(true);
  }

  selectedCard(card) {
    if (this._selectedCard === card) {
      this._selectedCard = null;
    } else {
      // this._moxService.editDeck(deck);
      this._selectedCard = card;
    }
  }

  delete(deck: MoxDeck) {
    if (confirm('This action can not be undone, are you sure?')) {
      this.afs.collection('decks').doc(deck.key).delete();
      this.toast.sendMessage('Deck successfully deleted!', 'success', deck.ownerId);
      this.router.navigate(['/deckhub']);
    } else {
      this.toast.sendMessage('Ops! Deck not deleted!', 'warning', deck.ownerId);
    }
  }

  countOccurrences(arr: string[], value: string) {
        let res = 0;
        arr.forEach(element => {
          if (element === value) {
            res++;
          }
        });
        return res;
    }

    changetab(side) {
      switch (side) {
        case 'left':
          // alert('LEFT');
          switch (this.tab) {
            case 'statsTab':
                this.tab = 'socialTab';
              break;
            case 'socialTab':
                this.tab = 'profileTab';
              break;
            case 'profileTab':
                this.tab = 'statsTab';
              break;
            default:
                alert('I`m sorry, I got lost');
              break;
          }
          break;
        case 'right':
          // alert('RIGHT');
          switch (this.tab) {
            case 'statsTab':
                this.tab = 'profileTab';
              break;
            case 'profileTab':
                this.tab = 'socialTab';
              break;
            case 'socialTab':
                this.tab = 'statsTab';
              break;
            default:
                alert('I`m sorry, I got lost');
              break;
          }
          break;
        default:
          break;
      }
    }

}
