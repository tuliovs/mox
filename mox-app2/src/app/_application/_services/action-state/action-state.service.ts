import { Observable, of, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ActionStateService {

  public _actionState = new Subject<any>();
  constructor() {
  }

  getState(): Observable<string> {
    return this._actionState.asObservable();
  }

  setState(newState: string) {
    this._actionState.next(newState);
  }
}
