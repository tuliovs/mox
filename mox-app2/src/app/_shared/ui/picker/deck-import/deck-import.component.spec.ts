import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckImportComponent } from './deck-import.component';

describe('DeckImportComponent', () => {
  let component: DeckImportComponent;
  let fixture: ComponentFixture<DeckImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
