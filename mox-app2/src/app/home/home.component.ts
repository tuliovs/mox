import { Component, OnInit, VERSION } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@envoirment/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  public v = environment.VERSION;
  public angularVersion = VERSION.full;
  constructor(private _router: Router) { }

  ngOnInit() {
  }

  goToUser() {
    this._router.navigateByUrl('/user');
  }
  goToDeckHub() {
    this._router.navigateByUrl('/deckhub');
  }
}
