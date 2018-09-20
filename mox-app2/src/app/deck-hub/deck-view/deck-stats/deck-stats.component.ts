import { Component, OnInit } from '@angular/core';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';

@Component({
  selector: 'app-mox-deck-stats',
  templateUrl: './deck-stats.component.html',
  styleUrls: ['./deck-stats.component.sass']
})
export class DeckStatsComponent implements OnInit {

  constructor(
    public _deckService: MoxDeckService
  ) { }

  ngOnInit() {
  }

}
