import { DeckProcess, DeckStatistics } from './../_models/_mox-models/MoxDeck';
import { ActionStateService } from './../_services/action-state/action-state.service';
import { Card } from '@application/_models/_scryfall-models/models';

export class DeckStats {

  constructor(
    public _state: ActionStateService
  ) { }

  static processStats(dkPs: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      if (!dkPs) {
        reject('#777 [processStats] - No deck to process');
      } else if (dkPs._cardList && dkPs._cardList.length > 0) {
        if (!dkPs._deckStats) {
          dkPs._deckStats = new DeckStatistics();
          dkPs._deckStats.key = dkPs._deck.key;
        }
        Promise.all([
          this.proPrice(dkPs),
          this.proLegalities(dkPs),
          this.proCardTypesTotals(dkPs),
          this.proColorId(dkPs),
          this.proCmcTotals(dkPs),
          this.proColorDevo(dkPs)
        ]).then(
          () => {
            dkPs._deckStats.processDate = new Date();
            resolve(dkPs);
          }
        ).catch(
          (err) => {
            dkPs.errorList.push(err);
            reject(err);
          }
        );
      } else {
        reject('#888 [StatsProcess] No Cards in List');
      }
    });
  }

  static proPrice(dkPs: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      try {
        dkPs.status = 'Processing Price';
        const t = dkPs._cardList
          .reduce((acc: number, cur?) =>
          acc + (this.countOccurrences(dkPs._deck.cards, cur.id) * (cur.usd ? Number(cur.usd) : 0)), 0);

        const s = dkPs._sideList
          .reduce((acc: number, cur?) =>
            acc + (this.countOccurrences(dkPs._deck.cards, cur.id) * (cur.usd ? Number(cur.usd) : 0)), 0);

        const x = dkPs._cardList
          .reduce((acc: number, cur?) =>
            acc + (this.countOccurrences(dkPs._deck.cards, cur.id) * (cur.tix ? Number(cur.tix) : 0)), 0);

        const z = dkPs._sideList
          .reduce((acc: number, cur?) =>
              acc + (this.countOccurrences(dkPs._deck.cards, cur.id) * (cur.tix ? Number(cur.tix) : 0)), 0);

        dkPs._deckStats.totalPrice = Number.parseFloat((t + s).toFixed(2));
        dkPs._deckStats.totalTix = Number.parseFloat((x + z).toFixed(2));
        resolve(dkPs);
      } catch (err) {
        dkPs.status = 'Error';
        console.error(err);
        dkPs.errorList.push(err);
        reject(new Error('Error processing processPrice'));
      }
    });
  }

  static proCardTypesTotals(dkPs: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      try {
        dkPs.status = 'Processing Card Types';
        dkPs.totalcards = dkPs._cardList.length;
        const typeLineCounter = {
          totalLands: this.countTypes(dkPs, 'land'),
          totalCreatures: this.countTypes(dkPs, 'creature'),
          totalInstants: this.countTypes(dkPs , 'instant'),
          totalSorcery: this.countTypes(dkPs , 'sorcery'),
          totalArtifacts: this.countTypes(dkPs, 'artifact'),
          totalEnchantments: this.countTypes(dkPs, 'enchantment'),
          totalPlaneswalkers: this.countTypes(dkPs, 'planeswalker'),
        };
        dkPs._deckStats.typeLineCounter = typeLineCounter;
        dkPs._deckStats.typeLineData = Object.values(typeLineCounter);
        resolve(dkPs);
      } catch (err) {
        dkPs.status = 'Error';
        console.error(err);
        dkPs.errorList.push(err);
        reject(new Error('Error processing TypesQtds'));
      }
    });
  }

  static proCmcTotals(dkPs: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      try {
        dkPs.status = 'Processing Cmc Totals';
        const arr = [];
        const cmc_max = dkPs._cardList.reduce((max, p) => p.cmc > max ? p.cmc : max, dkPs._cardList[0].cmc);
        for (let i = 0; i <= cmc_max; i++) {
          arr[i] = this.countCmc(dkPs, i);
        }
        dkPs._deckStats.cmcTotals = arr;
        resolve(dkPs);
      } catch (err) {
        dkPs.status = 'Error';
        console.error(err);
        dkPs.errorList.push(err);
        reject(new Error('Error processing proCmcTotals'));
      }
    });
  }

  static proColorDevo(dkPs: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      try {
        dkPs.status = 'Processing Color Devotion';
        const manaDevoCounter = {
          u: this.countManaId(dkPs, 'u'),
          b: this.countManaId(dkPs, 'b'),
          r: this.countManaId(dkPs, 'r'),
          g: this.countManaId(dkPs, 'g'),
          w: this.countManaId(dkPs, 'w'),
        };
        dkPs._deckStats.manaDevotion = manaDevoCounter;
        resolve(dkPs);
      } catch (err) {
        dkPs.status = 'Error';
        console.error(err);
        dkPs.errorList.push(err);
        reject(new Error('Error processing Color Devotion'));
      }
    });
  }

  static proLegalities(dkPs: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      try {
        if (dkPs._deck.format) {
          dkPs.status = 'Processing Legalities';
          const f = dkPs._deck.format;
          const errCountDeckList = dkPs._cardList
          .filter((card: Card) => {
            return card.legalities[f].valueOf() !== 'legal';
          }).length;

          const errCountSideList = dkPs._sideList
          .filter((card: Card) => {
            return card.legalities[f].valueOf() !== 'legal';
          }).length;

          if ( errCountDeckList > 0 || errCountSideList > 0 ) {
            dkPs._deck.legal = false;
            dkPs._cardList.filter((card: Card) => {
              return card.legalities[f].valueOf() !== 'legal';
            }).forEach((c: Card) => {
              const err = `Card Name: ${c.name} \n Legal Value: ${c.legalities[f].valueOf()}`;
              dkPs.errorList.push(err);
            });
          } else {
            dkPs._deck.legal = true;
          }
          resolve(dkPs);
        } else {
          resolve(dkPs);
        }
      } catch (err) {
        dkPs.status = 'Error';
        console.error(err);
        dkPs.errorList.push(err);
        reject(new Error('Error processing Legalities'));
      }
    });
  }

  static proColorId(dkPs: DeckProcess) {
    return new Promise<DeckProcess>((resolve, reject) => {
      try {
        if (dkPs._deck && dkPs._cardList.length > 0) {
          const colorIdentity = [];
          dkPs._cardList.forEach((c: Card) => {
            if (c.color_identity) {
              c.color_identity.forEach((value) => {
                if (colorIdentity.indexOf(value) === -1) { colorIdentity.push(value); }
              });
            } else {
              console.error('No Identity: ', c);
            }
          });
          dkPs._deckStats.colorIdentity = colorIdentity;
          dkPs._deck.colorIdentity = colorIdentity;
          dkPs._deckStats.guildIdentity = this.getGuildIdentity(colorIdentity);
          dkPs._deckStats.guildIco = this.getGuildIco(colorIdentity);
          resolve(dkPs);
        } else {
          reject('No deck');
          dkPs.status = 'Error';
          console.error('No deck');
          dkPs.errorList.push('No Deck');
        }
      } catch (err) {
        dkPs.status = 'Error';
        console.error(err);
        dkPs.errorList.push(err);
        reject(err);
      }
    });
  }

  static countTypes(dkPs: DeckProcess, param: string): number {
    return dkPs._cardList
          .reduce((acc: number, cur?) =>
          acc + (this.typeCounterValid(dkPs, cur, param)), 0);
  }

  static countCmc(dkPs: DeckProcess, param: number): number {
    return dkPs._cardList
          .filter(c => !c.type_line.includes('Land'))
          .reduce((acc: number, cur?) =>
          acc + (this.cmcValid(dkPs, cur, param)), 0);
  }

  static countManaId(dkPs: DeckProcess, param: string): number {
    return dkPs._cardList
        .reduce((acc: number, cur?) =>
          acc + (this.manaIdValid(dkPs, cur, param)), 0);
  }

  static typeCounterValid(deckProcess, currCard: Card, param: string) {
    const ocu = this.countOccurrences(deckProcess._deck.cards, currCard.id);
    const pass = (currCard.card_faces) ?
      currCard.card_faces[0].type_line.toLowerCase().trim().includes(param) :
      currCard.type_line.toLowerCase().trim().includes(param);
    return (pass) ? ocu : 0;
  }

  static cmcValid(dkPs: DeckProcess, currCard: Card, param: number) {
    const ocu: number = this.countOccurrences(dkPs._deck.cards, currCard.id);
    const cmc: number = (currCard.card_faces) ? currCard.card_faces[0].cmc : currCard.cmc;
    return (cmc === param) ? ocu : 0;
  }

  static manaIdValid(dkPs: DeckProcess, currCard: Card, param: string) {
    const ocu: number = this.countOccurrences(dkPs._deck.cards, currCard.id);
    const mana: string = (currCard.card_faces) ? currCard.card_faces[0].mana_cost : currCard.mana_cost;
    const pass = ocu * (mana.replace('{', '').split('}').filter(x => x.toLowerCase().includes(param.toLowerCase())).length);
    return pass;
  }

  static getGuildIdentity(colorId): string {
    const arr = Object.values<string>(colorId).map(x => x.toLowerCase());
    if (arr.length === 5) {  return 'WURGB'; }
    if (arr.length === 4) {  return 'Multicolored'; }

    if (arr.includes('g', 0) && arr.includes('w', 0) && arr.includes('u', 0) && arr.length === 3) {  return 'Bant: A Golden Utopia';  }
    if (arr.includes('b', 0) && arr.includes('w', 0) && arr.includes('u', 0) && arr.length === 3) {  return 'Esper';  }
    if (arr.includes('b', 0) && arr.includes('r', 0) && arr.includes('u', 0) && arr.length === 3) {  return 'Grixis';  }
    if (arr.includes('b', 0) && arr.includes('r', 0) && arr.includes('g', 0) && arr.length === 3) {  return 'Jund';  }
    if (arr.includes('w', 0) && arr.includes('r', 0) && arr.includes('g', 0) && arr.length === 3) {  return 'Naya: A Jungle Paradise';  }

    if (arr.includes('w', 0) && arr.includes('b', 0) && arr.includes('g', 0) && arr.length === 3) {  return 'Abzan Houses';  }
    if (arr.includes('r', 0) && arr.includes('u', 0) && arr.includes('w', 0) && arr.length === 3) {  return 'Jeskai Way';  }
    if (arr.includes('b', 0) && arr.includes('u', 0) && arr.includes('g', 0) && arr.length === 3) {  return 'Sultai Brood';  }
    if (arr.includes('r', 0) && arr.includes('w', 0) && arr.includes('b', 0) && arr.length === 3) {  return 'Mardu Horde';  }
    if (arr.includes('r', 0) && arr.includes('u', 0) && arr.includes('g', 0) && arr.length === 3) {  return 'Temur Frontier';  }
    // Rav Guilds
    if (arr.includes('r', 0) && arr.includes('w', 0) && arr.length === 2) {  return 'Boros Legion';  }
    if (arr.includes('b', 0) && arr.includes('u', 0) && arr.length === 2) {  return 'House Dimir';  }
    if (arr.includes('g', 0) && arr.includes('w', 0) && arr.length === 2) {  return 'Selesnya Conclave';  }
    if (arr.includes('b', 0) && arr.includes('g', 0) && arr.length === 2) {  return 'Golgari Swarm';  }
    if (arr.includes('u', 0) && arr.includes('r', 0) && arr.length === 2) {  return 'Izzet League';  }
    if (arr.includes('g', 0) && arr.includes('r', 0) && arr.length === 2) {  return 'Gruul Clans';  }
    if (arr.includes('b', 0) && arr.includes('w', 0) && arr.length === 2) {  return 'Orzhov Syndicate';  }
    if (arr.includes('g', 0) && arr.includes('u', 0) && arr.length === 2) {  return 'Simic Combine';  }
    if (arr.includes('b', 0) && arr.includes('r', 0) && arr.length === 2) {  return 'Cult of Rakdos';  }
    if (arr.includes('u', 0) && arr.includes('w', 0) && arr.length === 2) {  return 'Azorius Senate';  }

    if (arr.length === 1) {  return 'Mono Color'; }
    if (arr.length === 0) {  return 'Colorless'; }

    return 'Can`t determinate';
  }

  static getGuildIco(colorId): string {
    const arr = Object.values<string>(colorId).map(x => x.toLowerCase());
    if (arr.length === 5) {  return 'ss ss-dpa';  }
    if (arr.length === 4) {  return 'ss ss-dpa';  }

    // if (arr.includes('g', 0) && arr.includes('w', 0) && arr.includes('u', 0) && arr.length === 3) {  return 'Bant: A Golden Utopia';  }
    // if (arr.includes('b', 0) && arr.includes('w', 0) && arr.includes('u', 0) && arr.length === 3) {  return 'Esper';  }
    // if (arr.includes('b', 0) && arr.includes('r', 0) && arr.includes('u', 0) && arr.length === 3) {  return 'Grixis';  }
    // if (arr.includes('b', 0) && arr.includes('r', 0) && arr.includes('g', 0) && arr.length === 3) {  return 'Jund';  }
    // if (arr.includes('w', 0) && arr.includes('r', 0) && arr.includes('g', 0) && arr.length === 3) {  return 'Naya: A Jungle Paradise';  }

    if (arr.includes('w', 0) && arr.includes('b', 0) && arr.includes('g', 0) && arr.length === 3) {  return 'ms ms-clan-abzan';  }
    if (arr.includes('u', 0) && arr.includes('r', 0) && arr.includes('w', 0) && arr.length === 3) {  return 'ms ms-clan-jeskai';  }
    if (arr.includes('b', 0) && arr.includes('u', 0) && arr.includes('g', 0) && arr.length === 3) {  return 'ms ms-clan-sultai';  }
    if (arr.includes('r', 0) && arr.includes('w', 0) && arr.includes('b', 0) && arr.length === 3) {  return 'ms ms-clan-mardu';  }
    if (arr.includes('r', 0) && arr.includes('u', 0) && arr.includes('g', 0) && arr.length === 3) {  return 'ms ms-clan-temur';  }

    // if (arr.includes('r', 0) && arr.includes('u', 0) && arr.includes('g ', 0) && arr.length === 3) {  return 'clan-atarka'; }
    // if (arr.includes('r', 0) && arr.includes('u', 0) && arr.includes('g ', 0) && arr.length === 3) {  return 'clan-dromoka'; }
    // if (arr.includes('r', 0) && arr.includes('u', 0) && arr.includes('g ', 0) && arr.length === 3) {  return 'clan-kolaghan'; }
    // if (arr.includes('r', 0) && arr.includes('u', 0) && arr.includes('g ', 0) && arr.length === 3) {  return 'clan-ojutai'; }
    // if (arr.includes('r', 0) && arr.includes('u', 0) && arr.includes('g ', 0) && arr.length === 3) {  return 'clan-silumgar'; }
    // Rav Guilds
    if (arr.includes('r', 0) && arr.includes('w', 0) && arr.length === 2) {  return 'ms ms-guild-boros';  }
    if (arr.includes('b', 0) && arr.includes('u', 0) && arr.length === 2) {  return 'ms ms-guild-dimir';  }
    if (arr.includes('g', 0) && arr.includes('w', 0) && arr.length === 2) {  return 'ms ms-guild-selesnya';  }
    if (arr.includes('b', 0) && arr.includes('g', 0) && arr.length === 2) {  return 'ms ms-guild-golgari';  }
    if (arr.includes('u', 0) && arr.includes('r', 0) && arr.length === 2) {  return 'ms ms-guild-izzet';  }
    if (arr.includes('g', 0) && arr.includes('r', 0) && arr.length === 2) {  return 'ms ms-guild-gruul';  }
    if (arr.includes('b', 0) && arr.includes('w', 0) && arr.length === 2) {  return 'ms ms-guild-orzhov';  }
    if (arr.includes('g', 0) && arr.includes('u', 0) && arr.length === 2) {  return 'ms ms-guild-simic';  }
    if (arr.includes('b', 0) && arr.includes('r', 0) && arr.length === 2) {  return 'ms ms-guild-rakdos';  }
    if (arr.includes('u', 0) && arr.includes('w', 0) && arr.length === 2) {  return 'ms ms-guild-azorius';  }

    if (arr.includes('b', 0) && arr.length === 1) {  return 'ms ms-b';  }
    if (arr.includes('g', 0) && arr.length === 1) {  return 'ms ms-g';  }
    if (arr.includes('r', 0) && arr.length === 1) {  return 'ms ms-r';  }
    if (arr.includes('u', 0) && arr.length === 1) {  return 'ms ms-u';  }
    if (arr.includes('w', 0) && arr.length === 1) {  return 'ms ms-w';  }

    if (arr.length === 0) {  return 'ss ss-dpa';  }

    return 'ss ss-dpa';
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


export class CollectionStats {
  constructor(
    public _state: ActionStateService
  ) { }


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
