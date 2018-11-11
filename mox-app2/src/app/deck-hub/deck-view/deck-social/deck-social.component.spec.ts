import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckSocialComponent } from './deck-social.component';

describe('DeckSocialComponent', () => {
  let component: DeckSocialComponent;
  let fixture: ComponentFixture<DeckSocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckSocialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
