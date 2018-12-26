import { Component, OnInit } from '@angular/core';
import { AuthService } from '@karn/_services/auth.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';
import { FORMATS } from '@application/_constraints/FORMATS';

@Component({
  selector: 'app-mox-deck-social',
  templateUrl: './deck-social.component.html',
  styleUrls: ['./deck-social.component.sass']
})
export class DeckSocialComponent implements OnInit {
  public formats = FORMATS;
  public editing = false;
  constructor(
    public  _auth: AuthService,
    public _deckService: MoxDeckService,
  ) { }

  ngOnInit(
  ) {
  }

  // initMarkdown() {
  //   this._mdService.renderer.heading = (text: string, level: number) => {
  //     const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  //     return '<h' + level + '>' +
  //             '<a name="' + escapedText + '" class="anchor" href="#' + escapedText + '">' +
  //               '<span class="header-link"></span>' +
  //             '</a>' + text +
  //           '</h' + level + '>';
  //   };
  // }

  saveDeck() {
    this._deckService.update(this._deckService.deckProcess);
    this.editing = false;
  }
}
