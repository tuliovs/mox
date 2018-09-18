import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckContextComponent } from './deck-context.component';

describe('DeckContextComponent', () => {
  let component: DeckContextComponent;
  let fixture: ComponentFixture<DeckContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckContextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
