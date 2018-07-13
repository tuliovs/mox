import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowCardComponent } from './row-card.component';

describe('RowCardComponent', () => {
  let component: RowCardComponent;
  let fixture: ComponentFixture<RowCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
