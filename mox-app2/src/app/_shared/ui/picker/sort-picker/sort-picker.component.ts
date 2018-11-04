import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';

@Component({
  selector: 'app-mox-sort-picker',
  templateUrl: './sort-picker.component.html',
  styleUrls: ['./sort-picker.component.sass']
})
export class SortPickerComponent implements OnInit {

  constructor(
    public _state: ActionStateService,
    public _deckService: MoxDeckService
  ) { }
  @Input() selected: string;
  @Output() sortChoosen: EventEmitter<string> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  alphaU() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('alpha-up');
    this.closeContext();
  }
  alphaD() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('alpha-down');
    this.closeContext();
  }
  cmcU() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('cmc-up');
    this.closeContext();
  }
  cmcD() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('cmc-down');
    this.closeContext();
  }
  priceU() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('price-up');
    this.closeContext();
  }
  priceD() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('price-down');
    this.closeContext();
  }
  typeU() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('type-up');
    this.closeContext();
  }
  typeD() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('type-down');
    this.closeContext();
  }

  closeContext() {
    this.cancel.emit();
    this._state.returnState();
  }
}
