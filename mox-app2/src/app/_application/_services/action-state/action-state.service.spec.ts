import { TestBed, inject } from '@angular/core/testing';

import { ActionStateService } from '@application/_services/action-state/action-state.service';

describe('ActionstateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionStateService]
    });
  });

  it('should be created', inject([ActionStateService], (service: ActionStateService) => {
    expect(service).toBeTruthy();
  }));
});
