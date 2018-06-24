import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../../../_models/_scryfall-models/models';


@Injectable()
export class ScryfallCardService {

  constructor(private http: HttpClient) {}

  url = `https://api.scryfall.com/cards`;

  get(id: string): Observable<Card> {
    return this.http.get<Card>(`${this.url}/${id}`);
  }
}