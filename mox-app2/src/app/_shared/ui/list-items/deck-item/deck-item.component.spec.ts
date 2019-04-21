import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckItemComponent } from './deck-item.component';

describe('DeckItemComponent', () => {
  let component: DeckItemComponent;
  let fixture: ComponentFixture<DeckItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
