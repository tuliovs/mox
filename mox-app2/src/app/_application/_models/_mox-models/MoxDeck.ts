import { Card } from './../_scryfall-models/models';

export class MoxDeck {
  cards: string[];
  colorIdentity: string[];
  cover: string;
  creatorId?: string;
  description?: string;
  folder?: string;
  format: string;
  froze: boolean;
  key: string;
  legal: boolean;
  name: string;
  originayKey?: string;
  ownerId: string;
  ownerName: string;
  public: boolean;
  side: string[];
  updated: any[];
}

export class DeckProcess {
  _cardList: Card[];
  _deck?: MoxDeck;
  _deckStats?: DeckStatistics;
  _sideList: Card[];
  active = false;
  errorList?: any[];
  status: string;
  totalcards = 0;
}

export class DeckStatistics {
  colorIdentity?: any;
  cmcTotals: any[];
  guildIco?: string;
  guildIdentity?: string;
  key: string;
  manaDevotion?: any;
  processDate?: Date;
  totalPrice?: Number;
  totalTix?: Number;
  typeLineCounter?: any;
  typeLineData?: any[];
}

// "archetype": {
//   "color_identity": "",
//   "created": "",
//   "deck": "",
//   "format": "",
//   "key": "",
//   "promoted": "",
//   "updated": []
// },
// "card": {
//   "id": 0,
//   "multiverse_ids": [],
//   "oracle_id": 0,
//   "prints_search_uri": "",
//   "rulings_uri": "",
//   "scryfall_uri": "",
//   "uri": ""
// },
// "collection": {
//   "alias": "",
//   "card_count": 0,
//   "cards": [],
//   "created": "",
//   "id": 0,
//   "modified": "",
//   "owner": 0
// },
// "set": {
//   "block": "",
//   "block_code": "",
//   "card_count": 0,
//   "code": "",
//   "digital": false,
//   "foil_only": "",
//   "icon_svg_uri": "",
//   "mtgo_code": "",
//   "name": "",
//   "parent_set_code": "",
//   "released_at": 0,
//   "search_uri": "",
//   "set_type": ""
// },
// "user": {
//   "key": "",
//   "last_login": "",
//   "mail": "",
//   "online": false,
//   "passw": "",
//   "user_age": "",
//   "username": ""
// }
