import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mox-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.sass']
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() bgColor = '#132030';
  constructor() { }

  ngOnInit() {
  }

}
