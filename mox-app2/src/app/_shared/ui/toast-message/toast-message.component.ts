import { AuthService } from './../../../karn/_services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { ToastService, Message } from '../../../_application/_services/toast/toast.service';
import { filter, take, tap } from '../../../../../node_modules/rxjs/operators';
import { animate, keyframes, style, transition, trigger, state, query, stagger } from '@angular/animations';

export const swing = [
  style({transform: 'rotate3d(0, 0, 1, 15deg)', offset: .2}),
  style({transform: 'rotate3d(0, 0, 1, -10deg)', offset: .4}),
  style({transform: 'rotate3d(0, 0, 1, 5deg)', offset: .6}),
  style({transform: 'rotate3d(0, 0, 1, -5deg)', offset: .8}),
  style({transform: 'none', offset: 1})
];

@Component({
  selector: 'app-mox-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.sass'],
  animations: [
    trigger('notificationAnimator', [
      transition('* => swing', animate(1000, keyframes(swing))),
    ]),
  ]
})
export class ToastMessageComponent implements OnInit {
  public messages: any[] = [];
  public animationState: string;
  ribbonCounter(): number {
    return this.messages.length;
  }
  constructor(private toast: ToastService, public auth: AuthService) { }

  ngOnInit() {
    this.auth.getUser().pipe(
      filter(user => !!user),
      take(1),
      tap((user) => {
        if (user) {
          this.toast.getMessages(user.uid).pipe(
            tap((data) => {
              this.startAnimation('swing');
              this.messages = data.sort((x: Message, a: Message) => {
                if (x.time > a.time) {
                  return 1;
                } else if (x.time < a.time ) {
                  return -1;
                } else {
                  return 0;
                }
              }).filter( (m: Message) => {
                return !m.dismissed;
              });
              // console.log('>>', this.messages);
            })
          ).subscribe();
        }
      })
    ).subscribe();
  }

  dismissAll() {
    this.messages.forEach((msg: Message) => {
      this.toast.dismissMessage(msg.key);
    });
  }

  startAnimation(_state: string) {
    if (!this.animationState) {
      this.animationState = _state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  dismiss(itemKey) {
    this.toast.dismissMessage(itemKey);
  }
}
