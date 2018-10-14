
export class MoxDeck {
  cards: string[];
  creatorId?: string;
  colorIdentity: string[];
  cover: string;
  format: string;
  froze: boolean;
  key: string;
  legal: boolean;
  name: string;
  ownerId: string;
  ownerName: string;
  originayKey?: string;
  public: boolean;
  side: string[];
  updated: any[];
}

export class MoxCardDeck {
  cardId: string;
  quantity: number;
  side: number;
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