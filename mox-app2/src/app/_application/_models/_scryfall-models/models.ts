
export class Card {
  artist:            string;
  border_color:      string;
  cmc:               number;
  collector_number:  string;
  color_identity:    string[];
  colors:            string[];
  card_faces?:       any[];
  colorshifted:      boolean;
  digital:           boolean;
  edhrec_rank:       number;
  eur:               string;
  foil:              boolean;
  frame:             string;
  full_art:          boolean;
  futureshifted:     boolean;
  highres_image:     boolean;
  id:                string;
  illustration_id:   string;
  image_uris:        ImageUris;
  lang:              string;
  layout:            string;
  legalities:        { [key: string]: string };
  mana_cost:         string;
  mtgo_foil_id:      number;
  mtgo_id:           number;
  multiverse_ids:    number[];
  name:              string;
  nonfoil:           boolean;
  object:            string;
  oracle_id:         string;
  oracle_text:       string;
  oversized:         boolean;
  prints_search_uri: string;
  purchase_uris:     PurchaseUris;
  rarity:            string;
  related_uris:      RelatedUris;
  reprint:           boolean;
  reserved:          boolean;
  rulings_uri:       string;
  scryfall_set_uri:  string;
  scryfall_uri:      string;
  set_name:          string;
  set_search_uri:    string;
  set_uri:           string;
  set:               string;
  timeshifted:       boolean;
  tix:               string;
  type_line:         string;
  uri:               string;
  usd:               string;
}

export interface ImageUris {
  small:       string;
  normal:      string;
  large:       string;
  png:         string;
  art_crop:    string;
  border_crop: string;
}

export interface PurchaseUris {
  amazon:          string;
  ebay:            string;
  tcgplayer:       string;
  magiccardmarket: string;
  cardhoarder:     string;
  card_kingdom:    string;
  mtgo_traders:    string;
  coolstuffinc:    string;
}

export interface RelatedUris {
  gatherer:        string;
  tcgplayer_decks: string;
  edhrec:          string;
  mtgtop8:         string;
}

export class List {
  data: any[];
  has_more: boolean;
  next_page: string;
  total_cards: number;
  warnings: any[];

}
