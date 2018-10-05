import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { List } from '@application/_models/_scryfall-models/models';

@Injectable({
  providedIn: 'root'
})
export class ScryfallSearchService {
  constructor(private http: HttpClient) {}

  url      = `https://api.scryfall.com/cards/search?order=name&q=`;
  arenaUrl = `https://api.scryfall.com/cards`;
  fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=`;
  mtgoUrl  = `https://api.scryfall.com/cards/mtgo/`;

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
