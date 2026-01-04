import { TestBed } from '@angular/core/testing';

import { ListofValuesService } from './listof-values.service';

describe('ListofValuesService', () => {
  let service: ListofValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListofValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
