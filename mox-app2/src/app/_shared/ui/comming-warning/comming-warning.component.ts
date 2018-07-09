import { Component, OnInit } from '@angular/core';
import { trigger, style, keyframes, animate, transition } from '@angular/animations';

export const wobble = [
  style({transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)', offset: .15}),
  style({transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)', offset: .30}),
  style({transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)', offset: .45}),
  style({transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)', offset: .60}),
  style({transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)', offset: .75}),
  style({transform: 'none', offset: 1})
];

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
