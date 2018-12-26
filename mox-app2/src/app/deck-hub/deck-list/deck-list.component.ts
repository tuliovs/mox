import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@karn/_services/auth.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';
import { AngularFirestore } from '@angular/fire/firestore';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FORMATS } from '@application/_constraints/FORMATS';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, scan, mergeMap, throttleTime } from 'rxjs/operators';
import { MatRipple } from '@angular/material';

@Component({
  selector: 'app-mox-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.sass']
})
export class DeckListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  batch = 5;
  theEnd = false;

  offset = new BehaviorSubject(null);
  public infinite: Observable<any[]>;
  @ViewChild(MatRipple) ripple: MatRipple;
  public deckList: MoxDeck[];
  private internalDeck: any;
  private formatSelected: string;
  public folderVisible: boolean[] = [];
  public listAnimator: string;
  public _user: any;
  constructor(
    private _afs: AngularFirestore,
    private _deckService: MoxDeckService,
    private _state: ActionStateService,
    public _auth: AuthService,
    private _router: Router) { }

  ngOnInit() {
    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap(n => this.getBatch(n)),
      scan((acc, batch) => {
        return { ...acc, ...batch };
      }, {})
    );

    this.infinite = batchMap.pipe(map(v => Object.values(v)));
    this._auth.getUser().subscribe(
      (u) => {
        if (u) {
          // this._afs.collection('users').doc(u.uid).valueChanges().pipe(
          //   tap((moxUserData: any) => {
          //     if (moxUserData.favoriteFormat) { this.formatSelected = moxUserData.favoriteFormat; }
          //   })
          // ).subscribe();
          this._user = u;
          if (this.ripple) {
            this.ripple.centered = true;
            this.ripple.radius = 20;
          }
        }
      }
    );
  }

  getBatch(offset: string) {
    return this._afs
      .collection('decks', ref =>
        ref
          .orderBy('name')
          .startAfter(offset)
          .limit(this.batch)
          .where('public', '==', true)
      )
      .snapshotChanges()
      .pipe(
        tap(arr => (arr.length ? null : (this.theEnd = true))),
        tap((data) => {
          if (this.ripple) {
            this.ripple.centered = true;
            this.ripple.radius = 20;
          }
          this._state.setState('nav');
        }),
        map(arr => {
          return arr.reduce((acc, cur) => {
            const id = cur.payload.doc.id;
            const data = cur.payload.doc.data();
            return { ...acc, [id]: data };
          }, {});
        })
      );
  }

  nextBatch(e, offset) {
    if (this.theEnd) {
      return;
    }
    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    // console.log(`${end}, '>=', ${total}`);
    if (end === total) {
      this.offset.next(offset);
    }
  }

  trackByIdx(i) {
    return i;
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
      this._deckService.edit(deck);
      this.internalDeck = deck;
      this._state.setState('view');
    }
  }

  newDeck() {
    navigator.vibrate([40]);
    this._router.navigateByUrl('/deck/new');
  }

  navigateToDeckHub() {
    navigator.vibrate([40]);
    this._router.navigateByUrl('/deckhub');
  }

  changeFormat(side) {
    if (!this.formatSelected || this.formatSelected == null ) {
      this.formatSelected = 'standard';
      return;
    }
    switch (side) {
      case 'right':
        if (FORMATS.indexOf(this.formatSelected) + 1 === FORMATS.length) {
          this.setFormat('all');
        } else {
          this.setFormat(FORMATS[FORMATS.indexOf(this.formatSelected) + 1].valueOf());
        }
        break;
      case 'left':
        if (FORMATS.indexOf(this.formatSelected) - 1 < 0) {
          this.setFormat('all');
        } else {
          this.setFormat(FORMATS[FORMATS.indexOf(this.formatSelected) - 1].valueOf());
        }
        break;
    }
  }
}
