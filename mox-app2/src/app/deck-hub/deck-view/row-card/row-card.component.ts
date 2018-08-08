import { Card } from '@application/_models/_scryfall-models/models';
import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { MoxCardComponent } from '@shared/mox-card/mox-card.component';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { tap } from 'rxjs/operators';
import { ToastService } from '@application/_services/toast/toast.service';
import { AuthService } from '@karn/_services/auth.service';

@Component({
  selector: 'app-mox-row-card',
  templateUrl: './row-card.component.html',
  styleUrls: ['./row-card.component.sass']
})
export class RowCardComponent implements OnInit, AfterViewInit {
  public cardCollection: AngularFirestoreCollection<Card>;
  public _card: Card;
  public _user: any;
  public cardView = false;
  @Output() plus: EventEmitter<any> = new EventEmitter();
  @Output() minus: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Input() cardId;
  @Input() cardAmout;
  @Input() selected: boolean;
  constructor(
    public _cardService: MoxCardService,
    private afs: AngularFirestore,
    public toast: ToastService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.user.pipe(
      tap((user) => {
        this._user = user;
      })
    ).subscribe();
    if (!this.cardId) {
      this.toast.sendMessage('Not founded CardID, thats wierd...', 'danger', this._user.uid);
      throw new Error('Not founded CardID');
    } else {
      this._cardService.getCard(this.cardId);
    }
  }

  ngAfterViewInit() {
    this.afs.collection('cards').doc<Card>(this.cardId).valueChanges().pipe(
      tap((c) => {
        this._card = c;
        // console.log('cartinhas>', c);
      })
    ).subscribe();
  }
}
