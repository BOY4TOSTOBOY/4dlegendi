import { TestBed } from '@angular/core/testing';

import { GeneratedDataService } from './generated-data.service';

describe('GeneratedDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneratedDataService = TestBed.get(GeneratedDataService);
    expect(service).toBeTruthy();
  });
});
