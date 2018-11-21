import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckPickerComponent } from './deck-picker.component';

describe('DeckPickerComponent', () => {
  let component: DeckPickerComponent;
  let fixture: ComponentFixture<DeckPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
