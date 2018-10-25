import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mox-folder-picker',
  templateUrl: './folder-picker.component.html',
  styleUrls: ['./folder-picker.component.sass']
})
export class FolderPickerComponent implements OnInit {
  @Input() folders: string[];
  @Input() actualFolder?: string;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @Output() include: EventEmitter<any> = new EventEmitter();
  public _folderSelection: string;
  constructor() { }

  ngOnInit() {
  }

}
