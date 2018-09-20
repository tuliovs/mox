import { AngularFirestore } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CardMapper } from '@application/_mappers/scryfall-mappers/card/cardMapper';
import { Card } from '@application/_models/_scryfall-models/models';
import { MoxCardService } from '@application/_services/mox-services/card/mox-card.service';
import { ScryfallCardService } from '@application/_services/scryfall-services/card/scryfall-card.service';

@Component({
  selector: 'app-mox-card',
  templateUrl: './mox-card.component.html',
  styleUrls: ['./mox-card.component.sass']
})
export class MoxCardComponent implements OnInit, AfterViewInit {
  public card: Card;
  private id: any;
  constructor(
    private _cardService: MoxCardService,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
        const id = params['id'];
        if (!id) {
          throw new Error('Id não fornecido ou inválido');
        } else {
          this.id = id;
          this._cardService.getCard(id);
        }
      }
    );
  }

  ngAfterViewInit() {
    this.afs.collection('cards').doc<Card>(this.id).valueChanges().pipe(
      tap((c) => {
        this.card = c;
      })
    ).subscribe();
  }

}
