import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDeckContextComponent } from '@shared/ui/context-menu/import-deck-context/import-deck-context.component';

describe('ImportDeckContextComponent', () => {
  let component: ImportDeckContextComponent;
  let fixture: ComponentFixture<ImportDeckContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDeckContextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDeckContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
