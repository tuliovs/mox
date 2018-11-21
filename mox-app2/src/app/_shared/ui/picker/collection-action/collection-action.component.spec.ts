import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionActionComponent } from './collection-action.component';

describe('CollectionActionComponent', () => {
  let component: CollectionActionComponent;
  let fixture: ComponentFixture<CollectionActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
