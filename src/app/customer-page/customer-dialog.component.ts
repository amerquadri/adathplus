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
import { CustomerService } from './customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrl: './customer-dialog.component.css',
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

export class CustomerDialogComponent {
  public customer: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<CustomerDialogComponent>
    , private snackBar: MatSnackBar
  ) {
    this.customer = data && data.customer ? data.customer : {};
    //this.initializeDates();
  }

  /**
   * Initialize date fields - convert string dates to Date objects for mat-datepicker
   */
  // initializeDates() {
  //   if (this.customer.createdDate && typeof this.customer.createdDate === 'string') {
  //     this.customer.createdDate = new Date(this.customer.createdDate);
  //   }
  //   if (this.customer.updatedDate && typeof this.customer.updatedDate === 'string') {
  //     this.customer.updatedDate = new Date(this.customer.updatedDate);
  //   }
  // }

  /**
   * Convert Date objects back to ISO string format before saving
   */
  prepareDatesForSave() {
    const customerToSave = { ...this.customer };
    customerToSave.createdById = Number(sessionStorage.getItem('userId')) || 0;; // Example static value
    customerToSave.createdDate = new Date().toISOString(); // Current date-time
    customerToSave.isActive = true; // Default to active
    customerToSave.companyId = Number(sessionStorage.getItem('companyId')) || 0;
    customerToSave.updatedById = Number(sessionStorage.getItem('userId')) || 0;; // Example static value
    customerToSave.updatedDate = new Date().toISOString(); // Current date-time

    if (customerToSave.createdDate instanceof Date) {
      customerToSave.createdDate = customerToSave.createdDate.toISOString();
    }
    if (customerToSave.updatedDate instanceof Date) {
      customerToSave.updatedDate = customerToSave.updatedDate.toISOString();
    }

    return customerToSave;
  }

  onDeleteCustomer() {
    if (this.customer && this.customer.customerId) {
      this.customerService.deleteCustomer(this.customer.customerId).subscribe({
        next: () => {
          this.dialogRef.close('deleted');
        },
        error: (err: any) => {
          console.error('Delete failed', err);
        }
      });
    }
  }

  onSaveCustomer() {
    // const customerToSave = this.prepareDatesForSave();
    const customerToSave = { ...this.customer };

    if (customerToSave.customerName.length < 3) {
      this.snackBar.open('Customer name must be at least 3 characters long.', 'Close', {
        duration: 3000, verticalPosition: 'top',
      });
      return;
    }
    if (customerToSave.credit < 0 || customerToSave.debit < 0 || customerToSave.openingAmt < 0
      || customerToSave.credit == null || customerToSave.debit == null || customerToSave.openingAmt == null
    ) {
      this.snackBar.open('Amounts cannot be negative.', 'Close', {
        duration: 3000, verticalPosition: 'top',
      });
      return;
    }
    if (customerToSave && customerToSave.customerId) {
      this.customerService.updateCustomer(customerToSave).subscribe({
        next: (result: any) => {
          this.dialogRef.close('saved');
        },
        error: (err: any) => {
          console.error('Save failed', err);
        }
      });
    } else {
      customerToSave.customerId = 0; // Ensure customerId is set to 0 for new customers  
      this.customerService.insertCustomer(customerToSave).subscribe({
        next: (result: any) => {
          this.dialogRef.close('saved');
        },
        error: (err: any) => {
          console.error('Insert failed', err);
        }
      });
    }
  }
}