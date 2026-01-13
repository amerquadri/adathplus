import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBillComponent } from './customer-bill.component';

describe('CustomerBillComponent', () => {
  let component: CustomerBillComponent;
  let fixture: ComponentFixture<CustomerBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
