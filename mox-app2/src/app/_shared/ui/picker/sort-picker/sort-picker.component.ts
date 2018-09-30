import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { MoxDeckService } from '@application/_services/mox-services/deck/mox-deck.service';

@Component({
  selector: 'app-mox-sort-picker',
  templateUrl: './sort-picker.component.html',
  styleUrls: ['./sort-picker.component.sass'],
  animations: [
    trigger('deck-contextTrigger', [
      state('closed', style({
        transform: 'translate3d(0,100%, 0)',
        display: 'none'
      })),
      state('opened', style({
        transform: 'translate3d(0, 0, 0)',
        display: 'visible'
      })),
      transition('closed=>opened', animate('200ms')),
      transition('opened=>closed', animate('150ms'))
    ])
  ]
})
export class SortPickerComponent implements OnInit {

  constructor(
    public _state: ActionStateService,
    public _deckService: MoxDeckService
  ) { }
  @Input() icon;
  @Input() disabled;
  @Input() selected;
  @Output() sortChoosen: EventEmitter<any> = new EventEmitter();
  public componentState = 'closed';
  public lightboxActive = false;

  ngOnInit() {
  }

  alphaU() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('alphaU');
    this.closeContext();
  }
  alphaD() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('alphaD');
    this.closeContext();
  }
  cmcU() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('cmcU');
    this.closeContext();
  }
  cmcD() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('cmcD');
    this.closeContext();
  }
  priceU() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('priceU');
    this.closeContext();
  }
  priceD() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('priceD');
    this.closeContext();
  }
  typeU() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('typeU');
    this.closeContext();
  }
  typeD() {
    navigator.vibrate([30]);
    this.sortChoosen.emit('typeD');
    this.closeContext();
  }

  activatePicker() {
    navigator.vibrate([30]);
    this.lightboxActive = true;
    this.componentState = 'opened';
    this._state.setState('hidden');
  }

  closeContext() {
    this.lightboxActive = false;
    this.componentState = 'closed';
    this._state.returnState();
  }
}
