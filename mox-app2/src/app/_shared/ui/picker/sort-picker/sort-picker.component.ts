import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { slideInUp, slideOutDown } from '@application/_constraints/KEYFRAMES';
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
      transition('closed=>opened', animate('200ms', keyframes(slideInUp))),
      transition('opened=>closed', animate('150ms', keyframes(slideOutDown)))
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
