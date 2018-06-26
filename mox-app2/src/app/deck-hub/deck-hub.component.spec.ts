import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckHubComponent } from './deck-hub.component';

describe('DeckHubComponent', () => {
  let component: DeckHubComponent;
  let fixture: ComponentFixture<DeckHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
