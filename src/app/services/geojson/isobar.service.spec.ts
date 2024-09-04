import { TestBed } from '@angular/core/testing';

import { IsobarService } from './isobar.service';

describe('IsobarService', () => {
  let service: IsobarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsobarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
