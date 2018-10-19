import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { animate, style, keyframes, transition, trigger, state } from '@angular/animations';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';
import { tap } from 'rxjs/operators';
import { AuthService } from '@karn/_services/auth.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';

export const slideOutLeft = [
  style({'transform': 'translate3d(0, 0, 0)'}),
  style({'transform': 'translate3d(-100%, 0, 0)', 'visibility': 'hidden'})
];

export const slideOutRight = [
  style({'transform': 'translate3d(0, 0, 0)'}),
  style({'transform': 'translate3d(100%, 0, 0)', 'visibility': 'hidden'})
];

export const slideInLeft = [
  style({'transform': 'translate3d(-100%, 0, 0)', 'visibility': 'visible'}),
  style({'transform': 'translate3d(0, 0, 0)'})
];

export const slideInRight  = [
  style({'transform': 'translate3d(100%, 0, 0)', 'visibility': 'visible'}),
  style({'transform': 'translate3d(0, 0, 0)'})
];


@Component({
  selector: 'app-mox-deck-hub',
  templateUrl: './deck-hub.component.html',
  styleUrls: ['./deck-hub.component.sass'],
  animations: [
    trigger('listAnimator', [
      transition('* => exitLeft', animate(1250, keyframes(slideOutLeft))),
    ]),
    trigger('listAnimator', [
      transition('* => exitRight', animate(1250, keyframes(slideOutRight))),
    ]),
    trigger('listAnimator', [
      transition('* => entersLeft', animate(1250, keyframes(slideInLeft))),
    ]),
    trigger('listAnimator', [
      transition('* => entersRight', animate(1250, keyframes(slideInRight))),
    ]),
  ]
})

export class DeckHubComponent implements OnInit, AfterViewInit {
  public deckList: MoxDeck[];
  public formats = [
    'all',
    'standard',
    'modern',
    'legacy',
    'commander',
    'pauper',
    'vintage',
    'brawl',
    '1v1',
    'duek',
    'penny',
    'frontier',
    'future'
  ];
  private internalDeck: any;
  private formatSelected: string;
  public folderVisible: boolean[] = [];
  private deckCollection: AngularFirestoreCollection;
  public listAnimator: string;
  public folders: string[] = [];
  constructor(
    private _afs: AngularFirestore,
    private _deckService: MoxDeckService,
    private _state: ActionStateService,
    public _auth: AuthService,
    private _router: Router) {  }

  ngOnInit() {
    this._auth.getUser().subscribe(
      (u) => {
        if (u) {
          this._afs.collection('users').doc(u.uid).valueChanges().pipe(
            tap((moxUserData: any) => {
              if (moxUserData.favoriteFormat) { this.formatSelected = moxUserData.favoriteFormat; }
            })
          ).subscribe();
          this.deckCollection = this._afs.collection('decks', ref => ref.where('ownerId', '==', u.uid));
          this.deckCollection.valueChanges().pipe(
            tap((docL) => {
                this.deckList = <MoxDeck[]>docL.sort((a, b) => {
                  if (a.name < b.name) {
                    return -1;
                  } else if (a.name > b.name) {
                    return 1;
                  } else {
                    return 0;
                  }
                } );
                this.folders = [];
                this.filteredDeckList().forEach((deck) => {
                  if (deck.folder && deck.folder !== '' && !this.folders.includes(deck.folder)) {
                    this.folders.push(deck.folder);
                  }
                });
                this._state.setState('nav');
              }
            )
          ).subscribe();
        }
      }
    );
  }

  ngAfterViewInit() {
    this._deckService.getWorkingDeck().pipe(
      tap((workingDeck) => {
        this.internalDeck = workingDeck;
      })
    ).subscribe();
  }

  newDeck() {
    this._router.navigateByUrl('/deck/new');
  }

  setFormat(f) {
    (f === 'all') ? this.formatSelected = null : this.formatSelected = f;
  }

  filteredDeckList() {
    return (this.formatSelected) ? this.deckList.filter(x => x.format === this.formatSelected) : this.deckList;
  }

  deckSelected(deck: MoxDeck) {
    if (this.internalDeck === deck) {
      navigator.vibrate([30, 30]);
      this.internalDeck = null;
      this._state.setState('nav');
    } else {
      navigator.vibrate([30]);
      this._deckService.editDeck(deck);
      this.internalDeck = deck;
      this._state.setState('view');
    }
  }

  startAnimation(_state: string) {
    if (!this.listAnimator) {
      this.listAnimator = _state;
    }
  }

  resetAnimationState() {
    this.listAnimator = '';
  }

  changeFormat(side) {
    if (!this.formatSelected || this.formatSelected == null ) {
      this.formatSelected = 'standard';
      return;
    }
    switch (side) {
      case 'right':
        this.startAnimation('entersLeft');
        if (this.formats.indexOf(this.formatSelected) + 1 === this.formats.length) {
          this.setFormat('all');
        } else {
          this.setFormat(this.formats[this.formats.indexOf(this.formatSelected) + 1].valueOf());
        }
        break;
      case 'left':
      this.startAnimation('entersRight');
        if (this.formats.indexOf(this.formatSelected) - 1 < 0) {
          this.setFormat('all');
        } else {
          this.setFormat(this.formats[this.formats.indexOf(this.formatSelected) - 1].valueOf());
        }
        break;
    }
    this.folders = [];
    this.filteredDeckList().forEach((deck) => {
      if (deck.folder && deck.folder !== '' && !this.folders.includes(deck.folder)) {
        this.folders.push(deck.folder);
      }
    });
  }
}
