import { MoxCollection } from './../../../_application/_models/_mox-models/MoxCollection';
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
  @Input() currentState?: string;
  @Input() btnHidden = false;
  @ViewChild(MatRipple) ripple: MatRipple;
  @Output() folderRemove: EventEmitter<any> = new EventEmitter();
  @Output() folderInclude: EventEmitter<any> = new EventEmitter();
  @Output() coverActionChoosen: EventEmitter<string> = new EventEmitter();
  @Output() deckAddChoosen: EventEmitter<string> = new EventEmitter();
  @Output() collAddChoosen: EventEmitter<string> = new EventEmitter();
  @Output() pickerSelection: EventEmitter<string> = new EventEmitter();
  @Output() collectionSelection: EventEmitter<MoxCollection> = new EventEmitter();
  public componentState = 'closed';
  public lightboxActive = false;
  constructor(
    public _state: ActionStateService
  ) {  }

  ngOnInit() {
    if (this.ripple) {
      this.ripple.centered = true;
      this.ripple.radius = 20;
    }
  }

  pickerIcon() {
    switch (this.pickerType) {
      case 'folder' : return 'fas fa-folder';
      case 'sort' : return 'fas fa-sort';
      case 'card' : return 'ss ss-bcore';
      case 'deck-action' : return 'fas fa-book';
      case 'deck-import' : return 'fas fa-cloud-upload-alt';
      case 'new-coll' : return 'fas fa-plus';
      case 'coll-action' : return 'fas fa-archive';
      case 'deck-picker' : return 'fas fa-book';
      default : return 'fas fa-question';
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
    this._state.setState('nav');
  }
}
