import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerBillExpensesComponent } from './farmer-bill-expenses.component';

describe('FarmerBillExpensesComponent', () => {
  let component: FarmerBillExpensesComponent;
  let fixture: ComponentFixture<FarmerBillExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerBillExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerBillExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
