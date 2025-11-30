import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerPageComponent } from './farmer-page.component';

describe('FarmerPageComponent', () => {
  let component: FarmerPageComponent;
  let fixture: ComponentFixture<FarmerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
