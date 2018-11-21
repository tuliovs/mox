import { MoxCollection } from '@application/_models/_mox-models/MoxCollection';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mox-collection-item',
  templateUrl: './collection-item.component.html',
  styleUrls: ['./collection-item.component.sass']
})
export class CollectionItemComponent implements OnInit {
  @Input() collection: MoxCollection;
  @Input() selected: boolean;
  @Output() collSelected: EventEmitter<MoxCollection> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  collTypeIcon() {
    switch (this.collection.type) {
      case 'paper': return 'ss ss-parl';
      case 'mtgo': return 'ss ss-pmtg2';
      case 'arena': return 'ss ss-parl3';
      case 'wishlist': return 'ss ss-s99';
      default: return 'fas fa-archive';
    }
  }
}
