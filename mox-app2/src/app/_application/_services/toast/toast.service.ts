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

  constructor(content, style?, owner?) {
    this.content = content;
    this.style = style || 'info';
    this.time =  new Date();
    this.owner = owner || 'userNotProvided';
  }
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private afs: AngularFirestore, public auth: AuthService) { }

  getMessages(uid: string): Observable<Message[]> {
    return this.afs.collection<Message>('messages', ref => ref.where('owner', '==', uid).limit(5).orderBy('key')).valueChanges().pipe(

    );
  }

  sendMessage(content, style, owner) {
    const message = new Message(content, style, owner);
    this.afs.collection('messages').add(Object.assign({}, message));
  }

  dismissMessage(messageKey) {
    this.afs.collection('messages').doc(messageKey).update({'dismissed': true});
  }
}
