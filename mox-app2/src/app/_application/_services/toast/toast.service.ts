import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../../karn/_services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

export class Message {
  content: string;
  style: string;
  dismissed = false;
  time: Date;
  owner: string;
  key: string;

  constructor(content, style?, owner?, silent?) {
    this.content = content;
    this.style = style || 'info';
    this.time =  new Date();
    this.owner = owner || 'userNotProvided';
    this.dismissed = silent || false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private afs: AngularFirestore, public auth: AuthService) { }

  getMessages(uid: string) {
    return this.afs.collection('messages',
      ref => ref.where('owner', '==', uid).orderBy('time')).valueChanges();
  }

  sendMessage(content, style, owner, silent?) {
    const message = new Message(content, style, owner, silent);
    message.key = this.makeId();
    this.afs.collection('messages').doc(message.key).set(Object.assign({}, message)).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  dismissMessage(messageKey) {
    this.afs.collection('messages').doc(messageKey).update({'dismissed': true});
  }

  public makeId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
