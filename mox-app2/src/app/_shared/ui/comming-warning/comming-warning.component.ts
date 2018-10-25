import { Component, OnInit } from '@angular/core';
import { trigger, keyframes, animate, transition } from '@angular/animations';
import { wobble } from '@application/_constraints/KEYFRAMES';



@Component({
  selector: 'app-mox-comming-warning',
  templateUrl: './comming-warning.component.html',
  styleUrls: ['./comming-warning.component.sass'],
  animations: [
    trigger('cardAnimator', [
      transition('* => wobble', animate(1000, keyframes(wobble))),
    ])
  ]
})
export class CommingWarningComponent implements OnInit {

  constructor() { }

  animationState: string;

  startAnimation(state) {
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  ngOnInit() {
  }

}
