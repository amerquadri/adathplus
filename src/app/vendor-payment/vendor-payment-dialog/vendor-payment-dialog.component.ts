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
import { VendorPaymentServiceService } from '../vendor-payment-service.service';
import { VendorInterface, VendorPaymentInterface } from '../vendor-payment-interface';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormControl  } from '@angular/forms';
import {Observable, of} from 'rxjs';


@Component({
  selector: 'app-vendor-payment-dialog',
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
  
  ],
  templateUrl: './vendor-payment-dialog.component.html',
  styleUrls: ['./vendor-payment-dialog.component.css']
})

export class VendorPaymentDialogComponent implements OnInit {
  public vendor: any;
  public PaymentMethod = PaymentMethod; // Expose enum to template
  public vendorList: VendorInterface[] = [];

  
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  filteredOptions: Observable<string[]> = of(this.options);

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );


    this.loadVendorList();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vendorService: VendorPaymentServiceService,
    public dialogRef: MatDialogRef<VendorPaymentDialogComponent>
  ) {
    this.vendor = data && data.vendor ? data.vendor : {};
    this.initializeDates();
  }


  onVendorSelected(event: MatSelectChange) {
    // event.value is the selected vendorId (could be string or number)
    const selectedId = Number(event.value);
    const found = this.vendorList.find(v => Number(v.vendorId) === selectedId);
    if (found) {
      this.vendor.vendorId = found.vendorId;
      this.vendor.vendorName = found.vendorName;
    } else {
      // If not found, clear name but keep id
      this.vendor.vendorName = '';
    }
  }

initializeDates() {
    if (this.vendor.createdDate && typeof this.vendor.createdDate === 'string') {
      this.vendor.createdDate = new Date(this.vendor.createdDate);
    }
    if (this.vendor.updatedDate && typeof this.vendor.updatedDate === 'string') {
      this.vendor.updatedDate = new Date(this.vendor.updatedDate);
    }
  }

prepareDatesForSave() {
    const vendorToSave = { ...this.vendor };
    if (vendorToSave.createdDate instanceof Date) {
      vendorToSave.createdDate = vendorToSave.createdDate.toISOString();
    }
    if (vendorToSave.updatedDate instanceof Date) {
      vendorToSave.updatedDate = vendorToSave.updatedDate.toISOString();
    }
    // Ensure vendorName is set when vendorId is present by looking up the loaded vendor list.
    if ((!vendorToSave.vendorName || vendorToSave.vendorName === '') && vendorToSave.vendorId) {
      const found = this.vendorList.find(v => v.vendorId === vendorToSave.vendorId);
      if (found) vendorToSave.vendorName = found.vendorName;
    }

    return vendorToSave;
  }

  onDeleteVendor() {
    if (this.vendor && this.vendor.vendorId) {
      this.vendorService.deleteVendorPayment(this.vendor.vendorId,this.vendor.companyId).subscribe({
        next: () => {
          this.dialogRef.close('deleted');
        },
        error: (err: any) => console.error('Delete failed', err)
      });
    }
  }


onSaveVendor() {
    const vendorToSave = this.prepareDatesForSave();
    if (vendorToSave && vendorToSave.vendorId) {
      this.vendorService.insertVendorPayment(vendorToSave).subscribe({
       next: () => this.dialogRef.close('saved'),
        error: (err: any) => console.error('Save failed', err)
      });
    } else {
      vendorToSave.vendorId = 0;
      this.vendorService.insertVendorPayment(vendorToSave).subscribe({
        next: () => this.dialogRef.close('saved'),
       error: (err: any) => console.error('Insert failed', err)
      });
    }
  }

getVendorNameList() {
     this.vendorService.getVendorNameList().subscribe({
       next: (response: VendorInterface[]) => {
         this.vendorList = response || [];
       },
       error: (err: any) => console.error('Failed to load vendor list', err)
     });
  }

  private loadVendorList() {
    this.getVendorNameList();
  }


}
enum PaymentMethod {
  Cash = 'Cash',
  Draft = 'Draft',
  Cheque = 'Cheque',
  Online = 'Online',
  UPI = 'UPI'
}