import { Card } from '@application/_models/_scryfall-models/models';
import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { MoxCardComponent } from '@shared/mox-card/mox-card.component';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-mox-row-card',
  templateUrl: './row-card.component.html',
  styleUrls: ['./row-card.component.sass']
})
export class RowCardComponent implements OnInit, AfterViewInit {
  public cardCollection: AngularFirestoreCollection<Card>;
  public _card: Card;
  public cardView = false;
  @Output() plus: EventEmitter<any> = new EventEmitter();
  @Output() minus: EventEmitter<any> = new EventEmitter();
  @Input() cardId;
  @Input() cardAmout;
  constructor(
    public _cardService: MoxCardService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    if (!this.cardId) {
      throw new Error('Id não fornecido ou inválido');
    } else {
      this._cardService.getCard(this.cardId);
    }
  }

  ngAfterViewInit() {
    this.afs.collection('cards').doc<Card>(this.cardId).valueChanges().pipe(
      tap((c) => {
        this._card = c;
        console.log('cartinhas>', c);
      })
    ).subscribe();
  }
}
