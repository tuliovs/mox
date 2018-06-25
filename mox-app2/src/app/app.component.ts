import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'app';
  viewNav = false;
  constructor(private router: Router) {
    router.events.subscribe((val) => {
      // console.log('mudança de rota', val instanceof NavigationEnd);
      if (val instanceof NavigationEnd) {
        this.viewNav = false;
      }
    });
  }
}
