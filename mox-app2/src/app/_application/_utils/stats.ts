import { DeckProcess, DeckStatistics } from './../_models/_mox-models/MoxDeck';
import { ActionStateService } from './../_services/action-state/action-state.service';
import { Card } from '@application/_models/_scryfall-models/models';

export class DeckStats {

  constructor(
    public _state: ActionStateService
  ) { }

  static processStats(deckProcess: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      if (!deckProcess) {
        reject('#777 [processStats] - No deck to process');
      } else if (deckProcess._cardList && deckProcess._cardList.length > 0) {
        if (!deckProcess._deckStats) {
          deckProcess._deckStats = new DeckStatistics();
          deckProcess._deckStats.key = deckProcess._deck.key;
        }
        Promise.all([
          this.processPrice(deckProcess),
          this.processLegalities(deckProcess),
          this.processCardTypesQtds(deckProcess),
          this.processColorIdentity(deckProcess),
        ]).then(
          () => {
            deckProcess._deckStats.processDate = new Date();
            resolve(deckProcess);
          }
        ).catch(
          (err) => {
            deckProcess.errorList.push(err);
            reject(err);
          }
        );
      } else {
        reject('#888 [StatsProcess] No Cards in List');
      }
    });
  }

  static processPrice(deckProcess: DeckProcess) {
    return new Promise((resolve, reject) => {
      try {
        deckProcess.status = 'Processing Price';
        const t = deckProcess._cardList
          .reduce((acc: number, cur?) =>
          acc + (this.countOccurrences(deckProcess._deck.cards, cur.id) * (cur.usd ? Number(cur.usd) : 0)), 0);

        const s = deckProcess._sideList
          .reduce((acc: number, cur?) =>
            acc + (this.countOccurrences(deckProcess._deck.cards, cur.id) * (cur.usd ? Number(cur.usd) : 0)), 0);

        const x = deckProcess._cardList
          .reduce((acc: number, cur?) =>
            acc + (this.countOccurrences(deckProcess._deck.cards, cur.id) * (cur.tix ? Number(cur.tix) : 0)), 0);

        const z = deckProcess._sideList
          .reduce((acc: number, cur?) =>
              acc + (this.countOccurrences(deckProcess._deck.cards, cur.id) * (cur.tix ? Number(cur.tix) : 0)), 0);

        deckProcess._deckStats.totalPrice = Number.parseFloat((t + s).toFixed(2));
        deckProcess._deckStats.totalTix = Number.parseFloat((x + z).toFixed(2));
        resolve(deckProcess);
      } catch (err) {
        deckProcess.status = 'Error';
        console.error(err);
        deckProcess.errorList.push(err);
        reject(new Error('Error processing processPrice'));
      }
    });
  }

  static processCardTypesQtds(deckProcess: DeckProcess) {
    return new Promise((resolve, reject) => {
      try {
        deckProcess.status = 'Processing Card Types';
        deckProcess.totalcards = deckProcess._cardList.length;
        const typeLineCounter = {
          totalLands: this.countTypes(deckProcess, 'land'),
          totalCreatures: this.countTypes(deckProcess, 'creature'),
          totalInstants: this.countTypes(deckProcess , 'instant'),
          totalSorcery: this.countTypes(deckProcess , 'sorcery'),
          totalArtifacts: this.countTypes(deckProcess, 'artifact'),
          totalEnchantments: this.countTypes(deckProcess, 'enchantment'),
          totalPlaneswalkers: this.countTypes(deckProcess, 'planeswalker'),
        };
        deckProcess._deckStats.typeLineCounter = typeLineCounter;
        deckProcess._deckStats.typeLineData = Object.values(typeLineCounter);
        resolve(deckProcess);
      } catch (err) {
        deckProcess.status = 'Error';
        console.error(err);
        deckProcess.errorList.push(err);
        reject(new Error('Error processing TypesQtds'));
      }
    });
  }

  static processLegalities(deckProcess) {
    return new Promise((resolve, reject) => {
      try {
        if (deckProcess._deck.format) {
          deckProcess.status = 'Processing Legalities';
          const f = deckProcess._deck.format;
          const errCountDeckList = deckProcess._cardList
          .filter((card: Card) => {
            return card.legalities[f].valueOf() !== 'legal';
          }).length;

          const errCountSideList = deckProcess._sideList
          .filter((card: Card) => {
            return card.legalities[f].valueOf() !== 'legal';
          }).length;

          if ( errCountDeckList > 0 || errCountSideList > 0 ) {
            deckProcess._deck.legal = false;
            deckProcess._cardList.filter((card: Card) => {
              return card.legalities[f].valueOf() !== 'legal';
            }).forEach((c: Card) => {
              const err = `Card Name: ${c.name} \n Legal Value: ${c.legalities[f].valueOf()}`;
              deckProcess.errorList.push(err);
            });
          } else {
            deckProcess._deck.legal = true;
          }
          resolve(deckProcess);
        } else {
          resolve(false);
        }
      } catch (err) {
        deckProcess.status = 'Error';
        console.error(err);
        deckProcess.errorList.push(err);
        reject(new Error('Error processing Legalities'));
      }
    });
  }

  static processColorIdentity(deckProcess) {
    return new Promise((resolve, reject) => {
      try {
        if (deckProcess._deck && deckProcess._cardList.length > 0) {
          const colorIdentity = [];
          deckProcess._cardList.forEach((c: Card) => {
            if (c.color_identity) {
              c.color_identity.forEach((value) => {
                if (colorIdentity.indexOf(value) === -1) { colorIdentity.push(value); }
              });
            } else {
              console.error('No Identity: ', c);
            }
          });
          deckProcess._deckStats.colorIdentity = colorIdentity;
          deckProcess._deck.colorIdentity = colorIdentity;
          resolve(deckProcess);
        } else {
          reject('No deck');
          deckProcess.status = 'Error';
          console.error('No deck');
          deckProcess.errorList.push('No Deck');
        }
      } catch (err) {
        deckProcess.status = 'Error';
        console.error(err);
        deckProcess.errorList.push(err);
        reject(err);
      }
    });
  }

  static countTypes(deckProcess, param: string): number {
    const t = deckProcess._cardList
          .reduce((acc: number, cur?) =>
          acc + (this.typeCounterValid(deckProcess, cur, param)), 0);
    // console.log('#' + param, { cardList: this.deckProcess._cardList, Cont: t});
    return t;
  }

  static typeCounterValid(deckProcess, currCard: Card, param) {
    const ocu = this.countOccurrences(deckProcess._deck.cards, currCard.id);
    const pass = (currCard.card_faces) ?
      currCard.card_faces[0].type_line.toLowerCase().trim().includes(param) :
      currCard.type_line.toLowerCase().trim().includes(param);
    return (pass) ? ocu : 0;
  }

  static countOccurrences(arr: string[], value: string) {
    let res = 0;
    arr.forEach(el => {
      if (el === value) {
        res++;
      }
    });
    return res;
  }

}
