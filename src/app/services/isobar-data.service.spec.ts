import { TestBed } from '@angular/core/testing';

import { IsobarDataService } from './isobar-data.service';

describe('IsobarDataService', () => {
  let service: IsobarDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsobarDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
