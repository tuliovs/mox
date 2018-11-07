import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsHolderComponent } from './stats-holder.component';

describe('StatsHolderComponent', () => {
  let component: StatsHolderComponent;
  let fixture: ComponentFixture<StatsHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
