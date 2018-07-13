import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mox-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.sass']
})
export class ActionBarComponent implements OnInit {

  constructor() { }
  @Output() actionMenuActivate: EventEmitter<any> = new EventEmitter<any>();
  // @Output() swipeUp?: EventEmitter = new EventEmitter();
  // @Output() swipeRight?: EventEmitter = new EventEmitter();
  // @Output() swipeDown?: EventEmitter = new EventEmitter();
  ngOnInit() {
  }

  actionSwipeLeft() {
    // window.alert('LEFT');
    // this.actionMenuActivate.emit('diladin');
  }
  actionSwipeRight() {
    // window.alert('RIGHT');
    // this.actionMenuActivate.emit('diladin');
  }
  actionSwipeUp() {
    // window.alert('UP');
  }
  actionSwipeDown() {
    // window.alert('DOWN');
  }
}
