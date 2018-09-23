import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  public cardStorage = new Map();
  constructor() {
    this.cardStorage = new Map (JSON.parse(localStorage.getItem('cardStorage')));
  }

  updateCardStorage(id, card) {
    if (!this.cardStorage.has(id)) {
      if (this.cardStorage.size > 5000) {
        this.cardStorage = new Map();
      }
      this.cardStorage.set(id, card);
      this.set('cardStorage', JSON.stringify(Array.from(this.cardStorage.entries())));
    }
  }

  set(item: string, value) {
    localStorage.setItem(item, value);
  }

  get(item: string) {
      return localStorage.getItem(item);
  }

  remove(item: string) {
      return localStorage.removeItem(item);
  }
}
