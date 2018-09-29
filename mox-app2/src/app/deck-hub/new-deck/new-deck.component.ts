import { Component, OnInit } from '@angular/core';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';

@Component({
  selector: 'app-mox-new-deck',
  templateUrl: './new-deck.component.html',
  styleUrls: ['./new-deck.component.sass']
})
export class NewDeckComponent implements OnInit {
  constructor(
    private _moxService: MoxDeckService
  ) { }

  ngOnInit() {
  }

  quickDeck() {
    navigator.vibrate([30]);
    this._moxService.quickCreate();
  }

  cloneDeck() {
    alert('Not Implemented!');
  }

}
