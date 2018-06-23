import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoxCardComponent } from './mox-card.component';

describe('MoxCardComponent', () => {
  let component: MoxCardComponent;
  let fixture: ComponentFixture<MoxCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoxCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoxCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
