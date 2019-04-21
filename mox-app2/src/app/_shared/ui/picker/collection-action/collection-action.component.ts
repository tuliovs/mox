import { MoxCollectionService } from '@application/_services/mox-services/collection/mox-collection.service';
import { MoxCollection } from '@application/_models/_mox-models/MoxCollection';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@karn/_services/auth.service';
import { ActionStateService } from '@application/_services/action-state/action-state.service';
import { ToastService } from '@application/_services/toast/toast.service';
import { NgNavigatorShareService } from 'ng-navigator-share';

@Component({
  selector: 'app-mox-collection-action',
  templateUrl: './collection-action.component.html',
  styleUrls: ['./collection-action.component.sass']
})
export class CollectionActionComponent implements OnInit {
  @Input() collection: MoxCollection;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  constructor(
    public _router: Router,
    public _auth: AuthService,
    public _collServ: MoxCollectionService,
    private ngNavigatorShareService: NgNavigatorShareService,
    public _state: ActionStateService,
    public _toast: ToastService
  ) {
    this.ngNavigatorShareService = ngNavigatorShareService;
  }

  ngOnInit() {
  }

  exportList() {
    const newWindow = window.open('about:blank', '', '_blank');
    let textBlock = '<html><body><div> <br />';
    const pro = this._collServ._collProcess;
    pro.cardList.forEach(
      (card) => {
        textBlock = textBlock.concat(`${this._collServ.statTools.countOccurrences(pro.collection.cards, card.id)}  ${card.name} <br/>`);
      }
    );
    textBlock = textBlock + '</div></body></html>';
    if (newWindow) {
      newWindow.document.write(textBlock);
    }
  }

  share() {
    this.ngNavigatorShareService.share({
      title: 'Mox',
      text: '[Mox]DeckList - ' + this.collection.name,
      url: 'https://mox-mtg.firebaseapp.com/deck/' + this.collection.key
    }).then( (response) => {
      console.log(response);
      this.closeContext();
      this._state.returnState();
    })
    .catch( (error) => {
      console.log(error);
      alert('Error! ' + error);
    });
  }

  forkColl() {
    if (confirm('Hi dear friend! This action make a copy of this collection for you! Is that what you want?')) {
      this.closeContext();
      const pro = this._collServ._collProcess;
      this._collServ.fork(pro).then(
        (cp) => {
          this._router.navigate(['collection/' + cp.collection.key]);
        }
      ).catch(
        (err) => {
          console.error('Error! ' + err);
        }
      );
    }
  }

  closeContext() {
    this.cancel.emit();
    this._state.returnState();
  }
}
