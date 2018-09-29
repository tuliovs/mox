import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mox-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.sass']
})
export class DividerComponent implements OnInit {

  constructor() { }
  @Input() color: string;
  ngOnInit() {
  }

}
