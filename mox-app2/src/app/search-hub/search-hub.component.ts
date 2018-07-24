import { ScryfallSearchService } from '@application/_services/scryfall-services/search/scryfall-search.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { List } from '@application/_models/_scryfall-models/models';

@Component({
  selector: 'app-mox-search-hub',
  templateUrl: './search-hub.component.html',
  styleUrls: ['./search-hub.component.sass']
})
export class SearchHubComponent implements OnInit {
  public param: string;
  public searchResult: List = new List();
  public resp_time = 0;
  public settings_stats = false;
  public showLoader = false;
  public searchState = 'closed';
  public selectedCard;
  constructor(private _searchService: ScryfallSearchService) { }

  ngOnInit() {
  }


  selectCard(card: any) {
    console.log(card);
    this.selectedCard = card;
  }
  searchGo() {
    console.log('param: ', this.param);
    this.showLoader = true;
    this.settings_stats = true;
    this.resp_time = Date.now();
    this._searchService.search(this.param).subscribe(
        list => {
          // this._card = new CardMapper().map(card);
          this.searchResult = list;
          this.resp_time = Date.now() - this.resp_time;
          this.showLoader = false;
          console.log('>> ', this.searchResult);
        }
      );
  }
}
