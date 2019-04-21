
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { animate, keyframes, transition, trigger } from '@angular/animations';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';
import { tap } from 'rxjs/operators';
import { AuthService } from '@karn/_services/auth.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { FORMATS } from '@application/_constraints/FORMATS';
import { slideOutLeft, slideOutRight, slideInLeft, slideInRight } from '@application/_constraints/KEYFRAMES';
import { MatRipple } from '@angular/material';
import { PickerComponent } from '@shared/ui/picker/picker.component';

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
  @ViewChild(MatRipple) ripple: MatRipple;
  @ViewChild('collPiker') collPiker: PickerComponent;
  public deckList: MoxDeck[];
  private internalDeck: any;
  private formatSelected: string;
  private deckCollection: AngularFirestoreCollection;
  public listAnimator: string;
  public folders: string[] = [];
  public folderVisible: boolean[] = [];
  public _deckPicked;
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
                if (this.ripple) {
                  this.ripple.centered = true;
                  this.ripple.radius = 20;
                }
                this._state.setState('nav');
              }
            )
          ).subscribe();
        }
      }
    );
  }

  activateCollPicker(param) {
    this._deckPicked = param;
    this.collPiker.activatePicker();
  }
  ngAfterViewInit() {
    this._deckService.getWorkingDeck().pipe(
      tap((workingDeck) => {
        this.internalDeck = workingDeck;
      })
    ).subscribe();
  }

  navigateToDeckList() {
    navigator.vibrate([40]);
    this._router.navigateByUrl('/deck/list');
  }

  newDeck() {
    navigator.vibrate([40]);
    this._router.navigateByUrl('/deck/new');
  }

  viewDeck() {
    this._deckService.viewDeck();
  }

  setFormat(f) {
    (f === 'all') ? this.formatSelected = null : this.formatSelected = f;
  }

  filteredDeckList() {
    return (this.formatSelected) ? this.deckList.filter(x => x.format === this.formatSelected) : this.deckList;
  }

  deckFolderInclude(fparam) {
    this._deckService.deckProcess._deck.folder = fparam;
    this._deckService.update(this._deckService.deckProcess);
  }

  deckFolderRemove() {
    this._deckService.deckProcess._deck.folder = null;
    this._deckService.update(this._deckService.deckProcess);
  }

  deckSelected(deck: MoxDeck) {
    if (this.internalDeck === deck) {
      navigator.vibrate([30, 30]);
      this.internalDeck = null;
      this._state.setState('nav');
    } else {
      navigator.vibrate([30]);
      this._state.setState('loading');
      this.internalDeck = deck;
      this._deckService.edit(deck)
      .then(() => {
        this._state.setState('nav');
      })
      .catch(() => {
        this._state.setState('error');
      });
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
        if (FORMATS.indexOf(this.formatSelected) + 1 === FORMATS.length) {
          this.setFormat('all');
        } else {
          this.setFormat(FORMATS[FORMATS.indexOf(this.formatSelected) + 1].valueOf());
        }
        break;
      case 'left':
      this.startAnimation('entersRight');
        if (FORMATS.indexOf(this.formatSelected) - 1 < 0) {
          this.setFormat('all');
        } else {
          this.setFormat(FORMATS[FORMATS.indexOf(this.formatSelected) - 1].valueOf());
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
