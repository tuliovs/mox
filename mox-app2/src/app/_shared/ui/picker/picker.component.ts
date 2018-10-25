import { ActionStateService } from './../../../_application/_services/action-state/action-state.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { slideInUp, slideOutDown } from '@application/_constraints/KEYFRAMES';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-mox-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.sass'],
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
export class PickerComponent implements OnInit {
  @Input() enabled = true;
  @Input() pickerType: any;
  @Input() userFolders?: string[];
  @ViewChild(MatRipple) ripple: MatRipple;
  @Output() deckFolderRemove: EventEmitter<any> = new EventEmitter();
  @Output() deckFolderInclude: EventEmitter<any> = new EventEmitter();
  public componentState = 'closed';
  public lightboxActive = false;
  constructor(
    public _state: ActionStateService
  ) {  }

  ngOnInit() {
    this.ripple.centered = true;
    this.ripple.radius = 20;
  }

  pickerIcon() {
    switch (this.pickerType) {
      case 'folder':
        return 'fas fa-folder';
      default:
        return 'fas fa-question';
    }
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
