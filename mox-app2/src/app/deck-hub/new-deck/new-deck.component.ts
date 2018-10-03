import { Component, OnInit } from '@angular/core';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { MoxDeck } from '@application/_models/_mox-models/MoxDeck';

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

  async quickDeck() {
    navigator.vibrate([30]);
    this._moxService.quickCreate().then(
      (newDeck: MoxDeck) => {
        this._moxService.editDeck(newDeck);
        this._moxService.setDeck(newDeck);
      }
    ).catch(
      (err) => {
        console.error(err);
      }
    );
  }

  cloneDeck() {
    alert('Not Implemented!');
  }

}
