import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MoxCollection } from '@application/_models/_mox-models/MoxCollection';
import { MoxCollectionService } from '@application/_services/mox-services/collection/mox-collection.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { COLLTYPES } from '@application/_constraints/COLLECTION_TYPES';

@Component({
  selector: 'app-mox-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.sass']
})
export class NewCollectionComponent implements OnInit {
  public types = COLLTYPES;
  public newCollection = new MoxCollection();
  @Output() selection: EventEmitter<MoxCollection> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  constructor(
    public _collServ: MoxCollectionService,
    public _state: ActionStateService,
  ) { }

  ngOnInit() {
  }

  create() {
    const n = this.newCollection;
    if (n) {
      this.selection.emit(n);
      this.closeContext();
    } else {
      console.error('NO COLLECTION TO CREATE');
    }

  }

  closeContext() {
    this.cancel.emit();
    this._state.returnState();
  }

}
