import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  public cardStorage = new Map();
  public favsStorage = new Map();
  constructor() {
    this.cardStorage = new Map (JSON.parse(localStorage.getItem('cardStorage')));
    this.favsStorage = new Map (JSON.parse(localStorage.getItem('favsStorage')));
  }

  updateFavStorage(cardList) {
    if (cardList) {
      this.favsStorage.set('cards', cardList);
      this.setStorage('favsStorage', JSON.stringify(Array.from(this.favsStorage.entries())));
    }
  }

  updateCardStorage(id, card) {
    if (!this.cardStorage.has(id)) {
      if (this.cardStorage.size > 5000) {
        this.cardStorage = new Map();
      }
      this.cardStorage.set(id, card);
      this.setStorage('cardStorage', JSON.stringify(Array.from(this.cardStorage.entries())));
    }
  }

  setStorage(item: string, value) {
    localStorage.setItem(item, value);
  }

  getStorage(item: string) {
    return localStorage.getItem(item);
  }

  removeStorage(item: string) {
    return localStorage.removeItem(item);
  }
}
