import { Component, OnInit, Input } from '@angular/core';
import { ScryfallCardService } from '../../_application/_services/scryfall-services/card/scryfall-card.service';
import { Card } from '../../_application/_models/_scryfall-models/models';
import { CardMapper } from '../../_application/_mappers/scryfall-mappers/card/cardMapper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mox-card',
  templateUrl: './mox-card.component.html',
  styleUrls: ['./mox-card.component.sass']
})
export class MoxCardComponent implements OnInit {
  _card: Card;
  constructor(
    private _scryservice: ScryfallCardService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.params.subscribe( params => {
        const id = params['id'];
        if (!id) {
          throw new Error('Id não fornecido ou inválido');
        }

        this._scryservice.get(id).subscribe(
          card => {
            // this._card = new CardMapper().map(card);
            this._card = card;
            console.log('>> ', this._card);
          }
        );
      }
    );
  }
}
