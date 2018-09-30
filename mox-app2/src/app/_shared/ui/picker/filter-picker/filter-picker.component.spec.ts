import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPickerComponent } from './filter-picker.component';

describe('FilterPickerComponent', () => {
  let component: FilterPickerComponent;
  let fixture: ComponentFixture<FilterPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
