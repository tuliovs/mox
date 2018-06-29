import { Component, OnInit, AfterViewInit, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MoxDeckService } from './_application/_services/mox-services/deck/mox-deck.service';
import { MoxDeck } from './_application/_models/_mox_models/MoxDeck';
import { AuthService } from './karn/_services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, AfterViewInit {
  private title = 'Mox';
  public viewNav = false;
  public _Deck: MoxDeck;
  constructor(private router: Router, private _dekService: MoxDeckService, public auth: AuthService) {
    router.events.subscribe((val) => {
      // console.log('mudança de rota', val instanceof NavigationEnd);
      if (val instanceof NavigationEnd) {
        this.viewNav = false;
      }
    });
  }

  ngOnInit() {
    this._dekService.getWorkingDeck().pipe(
      tap((deck) => {
        this._Deck = <MoxDeck>deck;
        console.log(this._Deck);
        }
      )
    ).subscribe();
  }

  ngAfterViewInit() {
    this._dekService.getWorkingDeck().pipe(
      tap((deck) => {
        this._Deck = <MoxDeck>deck;
        console.log(this._Deck);
        }
      )
    ).subscribe();
  }
}
