import { TestBed } from '@angular/core/testing';

import { IsobarImageDataService } from './isobar-image-data.service';

describe('IsobarImageDataService', () => {
  let service: IsobarImageDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsobarImageDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
