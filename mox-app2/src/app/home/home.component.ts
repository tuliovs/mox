import { Component, OnInit } from '@angular/core';
import { ScryfallSearchService } from '../_application/_services/scryfall-services/search/scryfall-search.service';
import { List } from '../_application/_models/_scryfall-models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  private searchResult: List = new List();
  public resp_time = 0;
  public settings_stats = true;
  constructor(private _searchService: ScryfallSearchService) { }

  ngOnInit() {
  }

  searchGo(param: string) {
    console.log('param: ', param);
    this.resp_time = Date.now();
    this._searchService.search(param).subscribe(
        list => {
          // this._card = new CardMapper().map(card);
          this.searchResult = list;
          this.resp_time = Date.now() - this.resp_time;
          console.log('>> ', this.searchResult);
        }
      );

  }
}
