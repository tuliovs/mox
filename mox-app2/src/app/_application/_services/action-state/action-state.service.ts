import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ActionStateService {

  public _actionState = new BehaviorSubject('nav');
  public _lastState: string;
  constructor() {
  }

  getState(): Observable<string> {
    return this._actionState.asObservable();
  }

  setState(newState: string) {
    const actual = this._actionState.getValue();
    const last = this._lastState;
    if (!last && !actual) {
      this._actionState.next(newState);
      return;
    } else if (!last && actual) {
      this._lastState = actual;
      this._actionState.next(newState);
      return;
    } else if (last && actual && actual === newState) {
      return;
    } else if (last && actual && actual !== newState) {
      this._lastState = actual;
      this._actionState.next(newState);
    } else {
      console.error('ERROR: STATE: ', {actual, last, newState});
    }
  }

  returnState() {
    (this._lastState) ? this.setState(this._lastState) : this.setState('nav');
  }
}
