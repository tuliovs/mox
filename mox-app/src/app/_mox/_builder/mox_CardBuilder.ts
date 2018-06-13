import { MoxCard } from '../_models/mox_Card';


export class MoxCardBuilder {
  private _moxCard: MoxCard;
  constructor() {
    this._moxCard = new MoxCard();
  }

  raw(nani: any): MoxCard {
    return <MoxCard>(nani);
  }

  full(
        id: string,
        oracle_id: string,
        multiverse_ids: number[],
        mtgo_id: number,
        mtgo_foil_id: number,
        name: string,
        lang: string,
        uri: string,
        scryfall_uri: string,
        layout: string,
        highres_image: boolean,
        image_uris: any,
        mana_cost: string,
        cmc: number,
        type_line: string,
        oracle_text: string,
        colors: string[],
        color_identity: string[],
        legalities: { [key: string]: string },
        reserved: boolean,
        foil: boolean,
        nonfoil: boolean,
        oversized: boolean,
        reprint: boolean,
        set: string,
        set_name: string,
        set_uri: string,
        set_search_uri: string,
        scryfall_set_uri: string,
        rulings_uri: string,
        prints_search_uri: string,
        collector_number: string,
        digital: boolean,
        rarity: string,
        illustration_id: string,
        artist: string,
        frame: string,
        full_art: boolean,
        border_color: string,
        timeshifted: boolean,
        colorshifted: boolean,
        futureshifted: boolean,
        edhrec_rank: number,
        usd: string,
        tix: string,
        eur: string,
        related_uris: any,
        purchase_uris: any
  ): MoxCardBuilder {
      this._moxCard.id  = id;
      this._moxCard.oracle_id = oracle_id;
      this._moxCard.multiverse_ids  = multiverse_ids;
      this._moxCard.mtgo_id = mtgo_id;
      this._moxCard.mtgo_foil_id  = mtgo_foil_id;
      this._moxCard.name  = name;
      this._moxCard.lang  = lang;
      this._moxCard.uri = uri;
      this._moxCard.scryfall_uri = scryfall_uri;
      this._moxCard.layout = layout;
      this._moxCard.highres_image = highres_image;
      this._moxCard.image_uris = image_uris;
      this._moxCard.mana_cost = mana_cost;
      this._moxCard.cmc = cmc;
      this._moxCard.type_line = type_line;
      this._moxCard.oracle_text = oracle_text;
      this._moxCard.colors = colors;
      this._moxCard.color_identity = color_identity;
      this._moxCard.legalities = legalities;
      this._moxCard.reserved = reserved;
      this._moxCard.foil = foil;
      this._moxCard.nonfoil = nonfoil;
      this._moxCard.oversized = oversized;
      this._moxCard.reprint = reprint;
      this._moxCard.set = set;
      this._moxCard.set_name = set_name;
      this._moxCard.set_uri = set_uri;
      this._moxCard.set_search_uri = set_search_uri;
      this._moxCard.scryfall_set_uri = scryfall_set_uri;
      this._moxCard.rulings_uri = rulings_uri;
      this._moxCard.prints_search_uri = prints_search_uri;
      this._moxCard.collector_number = collector_number;
      this._moxCard.digital = digital;
      this._moxCard.rarity = rarity;
      this._moxCard.illustration_id = illustration_id;
      this._moxCard.artist = artist;
      this._moxCard.frame = frame;
      this._moxCard.full_art = full_art;
      this._moxCard.border_color = border_color;
      this._moxCard.timeshifted = timeshifted;
      this._moxCard.colorshifted = colorshifted;
      this._moxCard.futureshifted = futureshifted;
      this._moxCard.edhrec_rank = edhrec_rank;
      this._moxCard.usd = usd;
      this._moxCard.tix = tix;
      this._moxCard.eur = eur;
      this._moxCard.related_uris = related_uris;
      this._moxCard.purchase_uris = purchase_uris;

    return this;
  }

  build(): MoxCard {
    return this._moxCard;
  }
}
