import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatRipple } from '@angular/material';

@Component({
  selector: 'app-mox-stats-holder',
  templateUrl: './stats-holder.component.html',
  styleUrls: ['./stats-holder.component.sass']
})
export class StatsHolderComponent implements OnInit {
  @ViewChild(MatRipple) ripple: MatRipple;
  @Input() ico;
  @Input() title;
  constructor() { }

  ngOnInit() {
    if (this.ripple) {
      this.ripple.centered = true;
      this.ripple.radius = 50;
    }
  }

}
