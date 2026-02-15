import { Component, Inject, OnInit } from '@angular/core';
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
export class CustomerPaymentDialogComponent implements OnInit {
  public customer: any;
  public PaymentMethod = PaymentMethod; // Expose enum to template
  public customerList: CustomerInterface[] = [];

  // Autocomplete for customer selection
  customerControl = new FormControl('');
  customerOptions: string[] = [];
  filteredCustomers: Observable<string[]> = of([]);

  ngOnInit(): void {
    this.loadCustomerList();
  }

  private _filterCustomers(value: string): string[] {
    const filterValue = (value || '').toLowerCase();
    return this.customerOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private initCustomerAutocomplete(): void {
    // Populate options from customerList - customerName may be string or array
    this.customerOptions = this.customerList.map(c => {
      const name = c.customerName;
      if (Array.isArray(name)) {
        return name[0] || '';
      }
      return (name as unknown as string) || '';
    });
    
    // Set initial value if customer already has a name
    if (this.customer && this.customer.customerName) {
      const existingName = Array.isArray(this.customer.customerName) 
        ? this.customer.customerName[0] 
        : this.customer.customerName;
      this.customerControl.setValue(existingName || '');
    } else if (this.customer && this.customer.customerId) {
      const found = this.customerList.find(c => c.customerId === this.customer.customerId);
      if (found) {
        const foundName = Array.isArray(found.customerName) 
          ? found.customerName[0] 
          : (found.customerName as unknown as string);
        this.customerControl.setValue(foundName || '');
      }
    }
    
    // Setup filtered observable
    this.filteredCustomers = this.customerControl.valueChanges.pipe(
      startWith(this.customerControl.value || ''),
      map(value => this._filterCustomers(value || ''))
    );
  }

  onCustomerAutoSelected(selectedName: string): void {
    const target = (selectedName || '').trim();
    const found = this.customerList.find(c => {
      const name = c.customerName;
      const nameStr = Array.isArray(name) ? name[0] : (name as unknown as string);
      return (nameStr || '').trim() === target;
    });
    if (found) {
      this.customer.customerId = found.customerId;
      this.customer.customerName = found.customerName;
    } else {
      this.customer.customerId = null;
      this.customer.customerName = '';
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerPaymentService,
    public dialogRef: MatDialogRef<CustomerPaymentDialogComponent>
  ) {
    this.customer = data && data.customer ? data.customer : {};
  }

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
        this.initCustomerAutocomplete();
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
