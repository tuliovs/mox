import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardContextComponent } from './card-context.component';

describe('CardContextComponent', () => {
  let component: CardContextComponent;
  let fixture: ComponentFixture<CardContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardContextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
