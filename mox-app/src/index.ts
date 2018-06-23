import * as admin from 'firebase-admin';
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cret(serviceAccount)
});

import { ApolloServer, ApolloError, ValidationError, gql } from "apollo-server";

const typeDefs = gql`
  type Card {
    object:            string
    id:                string
    oracle_id:         string
    multiverse_ids:    [number]
    mtgo_id:           number
    mtgo_foil_id:      number
    name:              string
    lang:              string
    uri:               string
    scryfall_uri:      string
    layout:            string
    highres_image:     boolean
    image_uris:        ImageUris
    mana_cost:         string
    cmc:               number
    type_line:         string
    oracle_text:       string
    colors:            [string]
    color_identity:    [string]
    legalities:        { [key: string]: string }
    reserved:          boolean
    foil:              boolean
    nonfoil:           boolean
    oversized:         boolean
    reprint:           boolean
    set:               string
    set_name:          string
    set_uri:           string
    set_search_uri:    string
    scryfall_set_uri:  string
    rulings_uri:       string
    prints_search_uri: string
    collector_number:  string
    digital:           boolean
    rarity:            string
    illustration_id:   string
    artist:            string
    frame:             string
    full_art:          boolean
    border_color:      string
    timeshifted:       boolean
    colorshifted:      boolean
    futureshifted:     boolean
    edhrec_rank:       number
    usd:               string
    tix:               string
    eur:               string
    related_uris:      RelatedUris
    purchase_uris:     PurchaseUris
  }
`

// resolvers
const resolvers = {

};
