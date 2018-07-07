import { AuthService } from './../../../karn/_services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { ToastService } from '../../../_application/_services/toast/toast.service';
import { filter, take, tap } from '../../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-mox-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.sass']
})
export class ToastMessageComponent implements OnInit {
  messages: any;
  constructor(private toast: ToastService, public auth: AuthService) { }

  ngOnInit() {
    this.auth.user.pipe(
      filter(user => !!user),
      take(1),
      tap((user) => {
        if (user) {
          this.messages = this.toast.getMessages(user.uid);
          console.log('toast messages: ', this.messages);
        }
      })
    ).subscribe();
  }

  dismiss(itemKey) {
    this.toast.dismissMessage(itemKey);
  }
}
