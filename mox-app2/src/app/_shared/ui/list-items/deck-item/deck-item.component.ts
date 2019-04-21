import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';

@Component({
  selector: 'app-mox-deck-item',
  templateUrl: './deck-item.component.html',
  styleUrls: ['./deck-item.component.sass']
})
export class DeckItemComponent implements OnInit {
  @Input() deck: MoxDeck;
  @Input() selected: boolean;
  @Output() deckSelected: EventEmitter<MoxDeck> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
