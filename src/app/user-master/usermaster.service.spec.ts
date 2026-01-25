import { TestBed } from '@angular/core/testing';

import { UsermasterService } from './usermaster.service';

describe('UsermasterService', () => {
  let service: UsermasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsermasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
