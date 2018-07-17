import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { List } from '../../../_models/_scryfall-models/models';

@Injectable()
export class ScryfallSearchService {
  constructor(private http: HttpClient) {}

  url = `https://api.scryfall.com/cards/search?order=name&q=`;
  arenaUrl = `https://api.scryfall.com/cards`;
  fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=`;

  search(param: string): Observable<List> {
    return this.http.get<List>(`${this.url}${encodeURI(param)}`);
  }

  aernaSearch(cardSet: string, collectorsNumber: any): Observable<any> {
    return this.http.get(`${this.arenaUrl}/${encodeURI(cardSet)}/${collectorsNumber}`);
  }

  fuzzySearch(param: string) {
    return this.http.get(`${this.fuzzyUrl}${encodeURI(param)}`);
  }
}
