import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortPickerComponent } from './sort-picker.component';

describe('SortPickerComponent', () => {
  let component: SortPickerComponent;
  let fixture: ComponentFixture<SortPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
