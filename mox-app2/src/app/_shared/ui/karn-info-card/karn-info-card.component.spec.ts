import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KarnInfoCardComponent } from './karn-info-card.component';

describe('KarnInfoCardComponent', () => {
  let component: KarnInfoCardComponent;
  let fixture: ComponentFixture<KarnInfoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KarnInfoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KarnInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
