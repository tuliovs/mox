import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { List, Catalog } from '@application/_models/_scryfall-models/models';

@Injectable({
  providedIn: 'root'
})
export class ScryfallSearchService {
  constructor(private http: HttpClient) {}

  url      = `https://api.scryfall.com/cards/search?order=name&q=`;
  arenaUrl = `https://api.scryfall.com/cards`;
  fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=`;
  mtgoUrl  = `https://api.scryfall.com/cards/mtgo/`;
  autoUrl  = `https://api.scryfall.com/cards/autocomplete?q=`;

  autoSearch(param: string): Observable<Catalog> {
    return this.http.get<Catalog>(`${this.autoUrl}${encodeURI(param)}`);
  }

  search(param: string): Observable<List> {
    return this.http.get<List>(`${this.url}${encodeURI(param)}`);
  }

  getCardByMtgoId(mtgoId) {
    return this.http.get(`${this.mtgoUrl}${encodeURI(mtgoId)}`);
  }

  mtgArenaSearch(cardSet: string, collectorsNumber: any): Observable<any> {
    return this.http.get(`${this.arenaUrl}/${encodeURI(cardSet)}/${collectorsNumber}`);
  }

  fuzzySearch(param: string) {
    return this.http.get(`${this.fuzzyUrl}${encodeURI(param)}`);
  }
}
