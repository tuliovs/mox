import { AuthService } from '@karn/_services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService, Message } from '@application/_services/toast/toast.service';
import { filter, take, tap } from 'rxjs/operators';
import { animate, keyframes, transition, trigger } from '@angular/animations';
import { swing } from '@application/_constraints/KEYFRAMES';
import { MatRipple } from '@angular/material';

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
  public active = false;
  public animationState: string;
  public navigator = navigator;
  @ViewChild(MatRipple) ripple: MatRipple;
  ribbonCounter(): number {
    return this.messages.length;
  }
  constructor(private _toast: ToastService, public auth: AuthService) { }

  ngOnInit() {
    window['isUpdateAvailable']
    .then(isAvailable => {
      if (isAvailable) {
        this._toast.sendMessage('Hurray! Mox has a updated version!', 'info', isAvailable);
      }
    });

    this.auth.getUser().pipe(
      filter(user => !!user),
      take(1),
      tap((user) => {
        if (user) {
          this._toast.getMessages(user.uid).pipe(
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
              this.ripple.centered = true;
              this.ripple.radius = 20;
              // console.log('>>', this.messages);
            })
          ).subscribe();
        }
      })
    ).subscribe();
  }

  dismissAll() {
    this.messages.forEach((msg: Message) => {
      this._toast.dismissMessage(msg.key);
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
    this._toast.dismissMessage(itemKey);
  }
}
