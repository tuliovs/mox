import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommingWarningComponent } from '@shared/ui/comming-warning/comming-warning.component';

describe('CommingWarningComponent', () => {
  let component: CommingWarningComponent;
  let fixture: ComponentFixture<CommingWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommingWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommingWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
