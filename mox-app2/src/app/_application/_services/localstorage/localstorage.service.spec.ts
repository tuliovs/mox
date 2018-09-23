import { TestBed, inject } from '@angular/core/testing';

import { LocalstorageService } from '@application/_services/localstorage/localstorage.service';

describe('LocalstorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalstorageService]
    });
  });

  it('should be created', inject([LocalstorageService], (service: LocalstorageService) => {
    expect(service).toBeTruthy();
  }));
});
