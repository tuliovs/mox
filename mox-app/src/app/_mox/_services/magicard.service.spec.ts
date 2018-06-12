import { TestBed, inject } from '@angular/core/testing';

import { MagicardService } from './magicard.service';

describe('MagicardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MagicardService]
    });
  });

  it('should be created', inject([MagicardService], (service: MagicardService) => {
    expect(service).toBeTruthy();
  }));
});
