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
import { CustomerPaymentService } from '../customer-payment.service';
import { CustomerInterface, CustomerPaymentInterface } from '../customer-payment';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-customer-payment-dialog',
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
  templateUrl: './customer-payment-dialog.component.html',
  styleUrl: './customer-payment-dialog.component.css'
})
export class CustomerPaymentDialogComponent {
  public customer: any;
  public PaymentMethod = PaymentMethod; // Expose enum to template
  public customerList: CustomerInterface[] = [];
 
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  filteredOptions: Observable<string[]> = of(this.options);

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );


    this.loadCustomerList();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerPaymentService,
    public dialogRef: MatDialogRef<CustomerPaymentDialogComponent>
  ) {
    this.customer = data && data.customer ? data.customer : {};
    // this.initializeDates();
  }


  onCustomerSelected(event: MatSelectChange) {
    // event.value is the selected customerId (could be string or number)
    const selectedId = Number(event.value);
    const found = this.customerList.find(v => Number(v.customerId) === selectedId);
    if (found) {
      this.customer.customerId = found.customerId;
      this.customer.customerName = found.customerName;
    } else {
      // If not found, clear name but keep id
      this.customer.customerName = '';
    }
  }

  // initializeDates() {
  //   if (this.customer.createdDate && typeof this.customer.createdDate === 'string') {
  //     this.customer.createdDate = new Date(this.customer.createdDate);
  //   }
  //   if (this.customer.updatedDate && typeof this.customer.updatedDate === 'string') {
  //     this.customer.updatedDate = new Date(this.customer.updatedDate);
  //   }
  // }

  prepareDatesForSave() {
    const customerToSave = { ...this.customer };
    // if (customerToSave.createdDate instanceof Date) {
    //   customerToSave.createdDate = customerToSave.createdDate.toISOString();
    // }
    // if (customerToSave.updatedDate instanceof Date) {
    //   customerToSave.updatedDate = customerToSave.updatedDate.toISOString();
    // }

    // Ensure customerName is set when customerId is present by looking up the loaded customer list.
    if ((!customerToSave.customerName || customerToSave.customerName === '') && customerToSave.customerId) {
      const found = this.customerList.find(v => v.customerId === customerToSave.customerId);
      if (found) customerToSave.customerName = found.customerName;
    }

    return customerToSave;
  }

  onDeleteCustomer() {
    if (this.customer && this.customer.customerId) {
      this.customerService.deleteCustomerPayment(this.customer.customerId, this.customer.companyId).subscribe({
        next: () => {
          this.dialogRef.close('deleted');
        },
        error: (err: any) => console.error('Delete failed', err)
      });
    }
  }


  onSaveCustomer() {
    const customerToSave = this.prepareDatesForSave();
    if (customerToSave && customerToSave.customerId) {
      
      this.customerService.insertCustomerPayment(customerToSave).subscribe({
        next: () => this.dialogRef.close('saved'),
        error: (err: any) => console.error('Save failed', err)
      });
    } else {
      customerToSave.customerId = 0;
      this.customerService.insertCustomerPayment(customerToSave).subscribe({
        next: () => this.dialogRef.close('saved'),
        error: (err: any) => console.error('Insert failed', err)
      });
    }
  }

  getCustomerNameList() {
    this.customerService.getCustomerNameList().subscribe({
      next: (response: CustomerInterface[]) => {
        this.customerList = response || [];
      },
      error: (err: any) => console.error('Failed to load customer list', err)
    });
  }

  private loadCustomerList() {
    this.getCustomerNameList();
  }

}
enum PaymentMethod {
  Cash = 'Cash',
  Draft = 'Draft',
  Cheque = 'Cheque',
  Online = 'Online',
  UPI = 'UPI'
}
