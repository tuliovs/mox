import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteTagComponent } from './favorite-tag.component';

describe('FavoriteTagComponent', () => {
  let component: FavoriteTagComponent;
  let fixture: ComponentFixture<FavoriteTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
