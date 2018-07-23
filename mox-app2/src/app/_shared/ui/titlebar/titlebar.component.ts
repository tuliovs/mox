import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mox-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.sass']
})
export class TitlebarComponent implements OnInit {
  @Input() titleHeight = 2;
  constructor() { }

  ngOnInit() {
  }

}
