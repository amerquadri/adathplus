import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerBillComponent } from './farmer-bill.component';

describe('FarmerBillComponent', () => {
  let component: FarmerBillComponent;
  let fixture: ComponentFixture<FarmerBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
