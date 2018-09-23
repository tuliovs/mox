import { Mapper } from '@application/_mappers/_abstractions/Mapper';
import { Card } from '@application/_models/_scryfall-models/models';

export class CardMapper extends Mapper<Card> {

  constructor() {
    super(Card);
  }

  map(json): Card {
    let card = new Card();
    card = super.map(json);
    return card;
  }
}
