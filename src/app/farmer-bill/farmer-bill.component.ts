
import { Component, Inject, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MasterPageComponent } from "../master-page.component";

import { VendorInterface } from './farmer-bill-interface';
import { FarmerBillService } from './farmer-bill.service';
import { FarmerBillDetailModel,farmerBill } from './farmer-bill-interface';


@Component({
  selector: 'app-farmer-bill',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MasterPageComponent
  ],
  templateUrl: './farmer-bill.component.html',
  styleUrls: ['./farmer-bill.component.css']
})
export class FarmerBillComponent implements OnInit {

  constructor(private FarmerBillService: FarmerBillService) {

    //this.loadVendorList();
    this.getVendorNameList();
  }

  public _farmerBillDetail: FarmerBillDetailModel[] =[];
  public _farmerBill: farmerBill[]=[] ;

  public vendorList: VendorInterface[] = [];
  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  selectedVendorId: any = null;
  selectedParticular: string = 'Alu';


  getVendorNameList() {
    this.FarmerBillService.getVendors().subscribe({
      next: (response: VendorInterface[]) => {
        this.vendorList = response || [];
        this.options = this.vendorList.map(v => (v.vendorName || '').trim());
        // update filteredOptions in case valueChanges stream hasn't emitted yet
         // this.filteredOptions = of(this.options);
        //console.log('Vendor list loaded', this.vendorList);
      },
      error: (err: any) => console.error('Failed to load vendor list', err)
    });
  }

   insertFarmerBillDetails() { 
   this.FarmerBillService.InsertFarmerBillDetails(this._farmerBill, this._farmerBillDetail).subscribe({
      next: (response: any) => {
        console.log('Farmer Bill Details inserted', response);
      }
   })
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onVendorSelected(selectedName: string) {
    const target = (selectedName || '').trim();
    const found = this.vendorList.find(v => (v.vendorName || '').trim() === target);
    this.selectedVendorId = found ? found.vendorId : null;
    // you can use selectedVendorId for form submission or further logic
   // alert(`Selected Vendor ID: ${this.selectedVendorId}`);
  }

  private loadVendorList() {
    this.getVendorNameList();
  }

 

}
