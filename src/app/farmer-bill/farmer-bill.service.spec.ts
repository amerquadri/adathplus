import { TestBed } from '@angular/core/testing';

import { FarmerBillService } from './farmer-bill.service';

describe('FarmerBillService', () => {
  let service: FarmerBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarmerBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
