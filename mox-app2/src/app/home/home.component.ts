import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  constructor(private _router: Router) { }

  ngOnInit() {
  }

  newDeck() {
    this._router.navigateByUrl('/deck/new');
  }
  goToUser() {
    this._router.navigateByUrl('/user');
  }
  goToDeckHub() {
    this._router.navigateByUrl('/deckhub');
  }
}
