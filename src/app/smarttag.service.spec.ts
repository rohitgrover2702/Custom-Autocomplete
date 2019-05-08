import { TestBed, inject } from '@angular/core/testing';

import { SmarttagService } from './smarttag.service';

describe('SmarttagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmarttagService]
    });
  });

  it('should be created', inject([SmarttagService], (service: SmarttagService) => {
    expect(service).toBeTruthy();
  }));
});
