import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../_constrains/appSettings';
import { Observable, of } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { MoxCard } from '../_models/mox_Card';
import { MoxCardBuilder } from '../_builder/mox_CardBuilder';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
  const uri = AppSettings.API_SCRYFALL;
@Injectable({
  providedIn: 'root'
})

export class MoxMagiCardService {

  constructor(private http: Http) { }


  getMagicCard(cardId: number): Observable<MoxCard> {
    return this.http.get(uri + 'cards/' + cardId)
                .pipe(
                  tap(),
                  map(
                    (res) => { res.json(); }
                  ),
                  map( ( response: any) => {
                    return this.parseData(response);
                  } )
    );
  }

  private parseData(data): MoxCard {
    const _builder = new MoxCardBuilder();
    return _builder.raw(data);  // new MoxCard(data);
  }
}
