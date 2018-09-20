import { Card } from '@application/_models/_scryfall-models/models';
import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
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
  public _user: any;
  public cardView = false;
  @Output() plus: EventEmitter<any> = new EventEmitter();
  @Output() minus: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Input() card: Card;
  @Input() cardAmout;
  @Input() selected: boolean;
  constructor(
    public _cardService: MoxCardService,
    public toast: ToastService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    // console.log(this.card);
    this.auth.getUser().pipe(
      tap((user) => {
        this._user = user;
      })
    ).subscribe();
  }

  ngAfterViewInit() {
  }
}
