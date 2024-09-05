import { TestBed } from '@angular/core/testing';

import { IsothermService } from './isotherm.service';

describe('IsothermService', () => {
  let service: IsothermService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsothermService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
