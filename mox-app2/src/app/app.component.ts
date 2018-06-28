import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MoxDeckService } from './_application/_services/mox-services/deck/mox-deck.service';
import { MoxDeck } from './_application/_models/_mox_models/MoxDeck';
import { Subscription } from 'rxjs';
import { AuthService } from './karn/_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, AfterViewInit {
  private title = 'Mox';
  public viewNav = false;
  public _Deck: MoxDeck;
  private subs: Subscription;
  constructor(private router: Router, private _dekService: MoxDeckService, public auth: AuthService) {
    router.events.subscribe((val) => {
      // console.log('mudança de rota', val instanceof NavigationEnd);
      if (val instanceof NavigationEnd) {
        this.viewNav = false;
      }
    });
  }
  ngOnInit() {
    this.subs = this._dekService.getWorkingDeck().subscribe(
      resp => {
        this._Deck = resp;
      }
    );
  }

  ngAfterViewInit() {
    this._dekService.workingDeck.subscribe((res) => {
      console.log('Chegou> ', this._Deck);
      this._Deck = res;
    });
  }
}
