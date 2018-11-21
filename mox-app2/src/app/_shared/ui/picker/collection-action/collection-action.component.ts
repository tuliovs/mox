import { MoxCollection } from './../../../../_application/_models/_mox-models/MoxCollection';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mox-collection-action',
  templateUrl: './collection-action.component.html',
  styleUrls: ['./collection-action.component.sass']
})
export class CollectionActionComponent implements OnInit {
  @Input() collection: MoxCollection;
  constructor() { }

  ngOnInit() {
  }

}
