import { Component, OnInit, Input } from '@angular/core';
import { animate, style, transition, trigger, state, keyframes } from '@angular/animations';
import { Card } from '@application/_models/_scryfall-models/models';

export const jackInTheBox = [
  style({transform: 'scale(0.1) rotate(30deg)', 'transform-origin': 'center bottom', opacity: 0, offset: .0}),
  style({transform: 'rotate(-10deg)', offset: .50}),
  style({transform: 'rotate(3deg)', offset: .70}),
  style({transform: 'scale(1)', opacity: 1, offset: 1}),
];


@Component({
  selector: 'app-mox-karn-info-card',
  templateUrl: './karn-info-card.component.html',
  styleUrls: ['./karn-info-card.component.sass'],
  animations: [
    trigger('card-contextTrigger', [
      state('closed', style({
        transform: 'translate3d(0,100%, 0)',
        display: 'none'
      })),
      transition('closed=>opened', animate('500ms', keyframes(jackInTheBox))),
      transition('opened=>closed', animate('150ms'))
    ])
  ]
})
export class KarnInfoCardComponent implements OnInit {
  public componentState = 'closed';
  public lightboxActive = false;
  @Input() card;
  constructor() { }

  ngOnInit() {
    console.log(this.card);
  }

  activateContext() {
    this.lightboxActive = true;
    this.componentState = 'opened';
  }

  closeContext() {
    this.lightboxActive = false;
    this.componentState = 'closed';
  }

  mapLegal(data) {
    return Object.keys(data).map((v) => {
      const legal = {
        text: v,
        value: data[v]
      };
      return legal;
    });
  }
}
