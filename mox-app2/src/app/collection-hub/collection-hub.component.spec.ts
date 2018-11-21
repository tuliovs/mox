import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionHubComponent } from './collection-hub.component';

describe('CollectionHubComponent', () => {
  let component: CollectionHubComponent;
  let fixture: ComponentFixture<CollectionHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
