import { TestBed, inject } from '@angular/core/testing';

import { MoxMagiCardService } from './mox_MagiCard.service';

describe('MagicardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoxMagiCardService]
    });
  });

  it('should be created', inject([MoxMagiCardService], (service: MoxMagiCardService) => {
    expect(service).toBeTruthy();
  }));
});
