import { Component, Inject } from '@angular/core';
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
import { VendorService } from './vendor.service';

@Component({
  selector: 'app-vendor-dialog',
  templateUrl: './vendor-dialog.component.html',
  styleUrls: ['./vendor-dialog.component.css'],
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
    MatNativeDateModule
  ]
})
export class VendorDialogComponent {
  public vendor: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vendorService: VendorService,
    public dialogRef: MatDialogRef<VendorDialogComponent>
  ) {
    this.vendor = data && data.vendor ? data.vendor : {};
    // this.initializeDates();
  }

  // initializeDates() {
  //   if (this.vendor.createdDate && typeof this.vendor.createdDate === 'string') {
  //     this.vendor.createdDate = new Date(this.vendor.createdDate);
  //   }
  //   if (this.vendor.updatedDate && typeof this.vendor.updatedDate === 'string') {
  //     this.vendor.updatedDate = new Date(this.vendor.updatedDate);
  //   }
  // }

  prepareDatesForSave() {
    const vendorToSave = { ...this.vendor };
    if (vendorToSave.createdDate instanceof Date) {
      vendorToSave.createdDate = vendorToSave.createdDate.toISOString();
    }
    if (vendorToSave.updatedDate instanceof Date) {
      vendorToSave.updatedDate = vendorToSave.updatedDate.toISOString();
    }
    return vendorToSave;
  }

  onDeleteVendor() {
    if (this.vendor && this.vendor.vendorId) {
      this.vendorService.deleteVendor(this.vendor.vendorId).subscribe({
        next: () => {
          this.dialogRef.close('deleted');
        },
        error: (err: any) => console.error('Delete failed', err)
      });
    }
  }

  onSaveVendor() {
    
   // const vendorToSave = this.prepareDatesForSave();
    const vendorToSave = { ...this.vendor };

    vendorToSave.updatedDate = new Date().toISOString();
    vendorToSave.updatedById = Number(sessionStorage.getItem('userId')) || 0;
    vendorToSave.companyId = Number(sessionStorage.getItem('companyId')) || 0;
    vendorToSave.isActive =  true;
    vendorToSave.createdById = vendorToSave.createdById || Number(sessionStorage.getItem('userId')) || 0;
    vendorToSave.createdDate = vendorToSave.createdDate || new Date().toISOString();

    if (vendorToSave && vendorToSave.vendorId) {
      this.vendorService.updateVendor(vendorToSave).subscribe({
        next: () => this.dialogRef.close('saved'),
        error: (err: any) => console.error('Save failed', err)
      });
    } else {
      vendorToSave.vendorId = 0;
      this.vendorService.insertVendor(vendorToSave).subscribe({
        next: () => this.dialogRef.close('saved'),
        error: (err: any) => console.error('Insert failed', err)
      });
    }
  }
}

