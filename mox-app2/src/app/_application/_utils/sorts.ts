import { Card } from '@application/_models/_scryfall-models/models';

export class CardListSort {

  static sortAlphaUp (cardList: Card[]) {
    cardList = cardList.sort((a: Card, b: Card) => {
        if ( a.name < b.name ) { return -1; }
        if ( a.name > b.name ) { return 1; }
        return 0;
    });
    return cardList;
  }

  static sortAlphaDown (cardList: Card[]) {
    cardList = cardList.sort((a: Card, b: Card) => {
      if ( a.name > b.name ) { return -1; }
      if ( a.name < b.name ) { return 1; }
      return 0;
    });
    return cardList;
  }

  static sortCmcUp (cardList: Card[]) {
    cardList = cardList.sort((a: Card, b: Card) => {
        if ( Number(a.cmc) < Number(b.cmc) ) { return -1; }
        if ( Number(a.cmc) > Number(b.cmc) ) { return 1; }
        return 0;
    });
    return cardList;
  }

  static sortCmcDown (cardList: Card[]) {
    cardList = cardList.sort((a: Card, b: Card) => {
      if ( Number(a.cmc) > Number(b.cmc) ) { return -1; }
      if ( Number(a.cmc) < Number(b.cmc) ) { return 1; }
      return 0;
    });
    return cardList;
  }

  static sortPriceUp (cardList: Card[]) {
    cardList = cardList.sort((a: Card, b: Card) => {
      if ( Number(a.usd) < Number(b.usd) ) { return -1; }
      if ( Number(a.usd) > Number(b.usd) ) { return 1; }
      return 0;
    });
    return cardList;
  }

  static sortPriceDown (cardList: Card[]) {
    cardList = cardList.sort((a: Card, b: Card) => {
      if ( Number(a.usd) > Number(b.usd) ) { return -1; }
      if ( Number(a.usd) < Number(b.usd) ) { return 1; }
      return 0;
    });
    return cardList;
  }

  static sortTypeUp (cardList: Card[]) {
    cardList = cardList.sort((a: Card, b: Card) => {
      if ( a.type_line < b.type_line ) { return -1; }
      if ( a.type_line > b.type_line ) { return 1; }
      return 0;
    });
    return cardList;
  }

  static sortTypeDown (cardList: Card[]) {
    cardList = cardList.sort((a: Card, b: Card) => {
      if ( a.type_line > b.type_line ) { return -1; }
      if ( a.type_line < b.type_line ) { return 1; }
      return 0;
    });
    return cardList;
  }
}
