import { MoxDeck, DeckProcess } from '@application/_models/_mox-models/MoxDeck';
import { xml2json } from 'xml-js';
import { catchError, tap } from 'rxjs/operators';
import { Card } from '@application/_models/_scryfall-models/models';
import { of } from 'rxjs';
import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';

export class DeckIO {

  constructor(
    public _scrySearch: ScryfallSearchService
  ) { }

  public importMTGO(deckProcess, cardList: any) {
    return new Promise((result, reject) => {
      deckProcess.active = true;
      deckProcess.status = 'Importing from MTGO (.dek format)';
      deckProcess.totalcards = 0;
      const rsa = xml2json( cardList, { compact: false, spaces: 4 } );
      const a = JSON.parse(rsa);
      a.elements[0].elements.forEach(element => {
        if (element.name === 'Cards') {
          const element_card = element.attributes;
          deckProcess.totalcards = deckProcess.totalcards + Number(element_card.Quantity);
          this._scrySearch.getCardByMtgoId(element_card.CatID).pipe(
            tap((card: Card) => {
              if (card.name.replace('// ' , '').includes(element_card.Name.replace('/', ' '))) {
                if (deckProcess._deck.cards.length > 5 && deckProcess._deck.cards.length < 12) {
                    deckProcess._deck.cover = card.image_uris.art_crop;
                  }
                for (let index = 1; index <= element_card.Quantity; index++) {
                  if (element_card.Sideboard.toString().toLowerCase() === 'false') {
                    deckProcess._deck.cards.push(card.id);
                  } else {
                    deckProcess._deck.side.push(card.id);
                  }
                }
                if (deckProcess.totalcards === (deckProcess._deck.cards.length + deckProcess._deck.side.length)) {
                  result(deckProcess._deck);
                }
              } else {
                console.error({card : card.name.replace('// ' , '').trim(), element: element_card.Name.replace('/', ' ').trim() });
                reject (`${card} - ${element_card} `);
              }
            }),
            catchError((err, caught) => {
              if (err.status === 404) {
                this._scrySearch.fuzzySearch(element_card.Name).pipe(
                  tap((card: Card) => {
                    if (deckProcess._deck.cards.length > 5 && deckProcess._deck.cards.length < 12) {
                      deckProcess._deck.cover = card.image_uris.art_crop;
                    }
                    for (let index = 1; index <= element_card.Quantity; index++) {
                      if (element_card.Sideboard.toString().toLowerCase() === 'false') {
                        deckProcess._deck.cards.push(card.id);
                      } else {
                        deckProcess._deck.side.push(card.id);
                      }
                    }
                    if (deckProcess.totalcards === (deckProcess._deck.cards.length + deckProcess._deck.side.length)) {
                      result(deckProcess._deck);
                    }
                  })
                ).subscribe();
              } else {
                console.error({err: err, caught: caught });
                reject (err);
                return of(null);
              }
            })
          ).subscribe();
        }
      });
    });
  }

  public importArena(deckProcess: DeckProcess, cardList: any) {
    return new Promise<MoxDeck>((resolve, reject) => {
      deckProcess.active = true;
      deckProcess.status = 'Importing from Magic Arena fromat';
      deckProcess.totalcards = 0;
      deckProcess.errorList = [];
      cardList.valueOf().split('\n').filter(v => v !== '' ).forEach((elt, idx, arr) => {
        if (elt && elt.length > 0) {
          const qnt = +elt.substr(0, 2);
          const cardname = elt.substr(2, elt.indexOf('(') - 2);
          // const set = elt.substr(elt.indexOf('(') + 1, 3).toLowerCase().replace('dar', 'dom');
          // const collectorsNumber = +elt.substr(elt.length - 2, 3);
          deckProcess.totalcards = deckProcess.totalcards + qnt;
          this._scrySearch.fuzzySearch(cardname).pipe(
            tap((c: Card) => {
              if (c.name.replace('// ', '').trim() === cardname.trim()) {
                for (let index = 1; index <= qnt; index++) {
                  deckProcess._deck.cards.push(c.id);
                  if (deckProcess._deck.cards.length === 6) { deckProcess._deck.cover = c.image_uris.art_crop; }
                }
              } else {
                deckProcess.errorList.push({
                  msg: `Card Not Found: Searched Parms: ${c.name.trim()} - ${cardname.trim()}`,
                  card: c,
                });
              }
            }),
          ).subscribe();

          if (idx === arr.length - 1) {
            if (deckProcess._deck) {
              const c = deckProcess._deck.cards.length + deckProcess._deck.side.length;
              if (c === deckProcess.totalcards) {
                console.log('Import Res!');
                resolve(deckProcess._deck);
              } else {
                reject(deckProcess.errorList);
              }
            }
          }
        }
      });
    });
  }

  public importTxt(deckProcess: DeckProcess, cardList: any) {
    return new Promise<MoxDeck>((resolve, reject) => {
      deckProcess.active = true;
      deckProcess.status = 'Importing from text format';
      deckProcess.totalcards = 0;
      deckProcess.errorList = [];
      cardList.valueOf().split('\n').filter(v => v !== '' ).forEach((elt, idx, arr) => {
        if (elt && elt.length > 0) {
          const qnt = +elt.substr(0, 2);
          const cardname = elt.substr(2, elt.length);
          deckProcess.totalcards = deckProcess.totalcards + qnt;
          this._scrySearch.fuzzySearch(cardname).pipe(
            tap((c: Card) => {
              if (c.name === cardname) {
                for (let index = 1; index <= qnt; index++) {
                  deckProcess._deck.cards.push(c.id);
                }
                if (deckProcess._deck.cards.length === 6) { deckProcess._deck.cover = c.image_uris.art_crop; }
              } else {
                deckProcess.errorList.push({
                  msg: `Card Not Found: Searched Parms: ${c.name.trim()} - ${cardname.trim()}`,
                  card: c,
                });
              }
            })
          ).subscribe();

          if (idx === arr.length - 1) {
            if (deckProcess._deck) {
              const c = deckProcess._deck.cards.length + deckProcess._deck.side.length;
              if (c === deckProcess.totalcards) {
                console.log('Import Res!');
                resolve(deckProcess._deck);
              } else {
                reject(deckProcess.errorList);
              }
            }
          }
        }
      });
    });
  }
}
