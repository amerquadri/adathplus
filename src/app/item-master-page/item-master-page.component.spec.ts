import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMasterPageComponent } from './item-master-page.component';

describe('ItemMasterPageComponent', () => {
  let component: ItemMasterPageComponent;
  let fixture: ComponentFixture<ItemMasterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMasterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
