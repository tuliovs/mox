import { Component, OnInit } from '@angular/core';
import { MoxDeck } from '../../_application/_models/_mox_models/MoxDeck';

@Component({
  selector: 'app-mox-new-deck',
  templateUrl: './new-deck.component.html',
  styleUrls: ['./new-deck.component.sass']
})
export class NewDeckComponent implements OnInit {
  public newDeck: MoxDeck;
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
  constructor() {
    this.newDeck = new MoxDeck();
    this.newDeck.owner = 'TulioVersus';
    this.newDeck.froze = false;
  }

  ngOnInit() {
  }

  createDeck() {
    console.log('DeckCriado: ', this.newDeck);
  }
}
