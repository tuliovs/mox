import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPickerComponent } from './collection-picker.component';

describe('CollectionPickerComponent', () => {
  let component: CollectionPickerComponent;
  let fixture: ComponentFixture<CollectionPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
