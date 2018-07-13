import { ScryfallSearchService } from './../../../_application/_services/scryfall-services/search/scryfall-search.service';
import { Component, OnInit } from '@angular/core';
import { List } from '../../../_application/_models/_scryfall-models/models';
import { animate, keyframes, style, transition, trigger, state } from '@angular/animations';

export const bounceInDown = [
  style({transform: 'translate3d(0, -3000px, 0)', opacity: 0, offset: .0}),
  style({transform: 'translate3d(0, 25px, 0)', opacity: 1, offset: .60}),
  style({transform: 'translate3d(0, -10px, 0)', offset: .75}),
  style({transform: 'translate3d(0, 5px, 0)', offset: .90}),
  style({transform: 'translate3d(0, 0, 0)', offset: 1}),
];

@Component({
  selector: 'app-mox-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass'],
  animations: [
    trigger('searchTrigger', [
      state('closed', style({
        transform: 'translate3d(-100%, 0, 0)',
        display: 'none'
      })),
      // state('opened', style({
      //   transform: 'translate3d(0, 0, 0)',
      //   display: 'visible'
      // })),
      transition('*=>opened', animate('800ms', keyframes(bounceInDown))),
      transition('opened=>closed', animate('200ms'))
    ])
  ]
})


export class SearchComponent implements OnInit {
  public isSearchActive = false;
  public searchResult: List = new List();
  public resp_time = 0;
  public settings_stats = true;
  showLoader = false;
  public searchState = 'closed';
  constructor(private _searchService: ScryfallSearchService) { }

  ngOnInit() {
  }

  searchGo(param: string) {
    console.log('param: ', param);
    this.showLoader = true;
    this.resp_time = Date.now();
    this._searchService.search(param).subscribe(
        list => {
          // this._card = new CardMapper().map(card);
          this.searchResult = list;
          this.resp_time = Date.now() - this.resp_time;
          this.showLoader = false;
          console.log('>> ', this.searchResult);
        }
      );
  }

  activeSearch() {
    this.searchState = (this.searchState === 'closed') ? 'opened' : 'closed';
    // this.isSearchActive = true;
  }

  closeSearch() {
    this.searchState = 'closed';
  }
}
