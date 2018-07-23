import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHubComponent } from './search-hub.component';

describe('SearchHubComponent', () => {
  let component: SearchHubComponent;
  let fixture: ComponentFixture<SearchHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
