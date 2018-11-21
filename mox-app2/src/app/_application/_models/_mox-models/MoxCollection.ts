import { Card } from './../_scryfall-models/models';

export class MoxCollection {
  cards: string[];
  cover: string;
  created: Date;
  description?: string;
  folder?: string;
  key: string;
  name: string;
  ownerId: string;
  ownerName: string;
  processDate?: Date;
  totalPrice?: Number;
  totalTix?: Number;
  type: string;
  updated: any[];
}

export class CollectionProcess {
  cardList: Card[];
  collection: MoxCollection;
  errorList?: any[];
  status: string;
  totalcards = 0;
}
