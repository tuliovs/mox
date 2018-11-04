import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckActionComponent } from './deck-action.component';

describe('DeckActionComponent', () => {
  let component: DeckActionComponent;
  let fixture: ComponentFixture<DeckActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
