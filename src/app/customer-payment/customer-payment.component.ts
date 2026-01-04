import { Component } from '@angular/core';
import { MasterPageComponent } from '../master-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
//import { VendorPaymentInterface } from '../vendor-payment/vendor-payment-interface';
import { CustomerPaymentInterface } from '../customer-payment/customer-payment';
import { CustomerPaymentService } from './customer-payment.service';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../customer-page/confirm-dialog.component';
import { CustomerPaymentDialogComponent } from './customer-payment-dialog/customer-payment-dialog.component';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-customer-payment',
  standalone: true,
  imports: [MasterPageComponent, ReactiveFormsModule, FormsModule, MatInputModule,
    MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatDialogModule, MatTableModule, MatSortModule, MatPaginatorModule,
    CommonModule],
  templateUrl: './customer-payment.component.html',
  styleUrl: './customer-payment.component.css'
})
export class CustomerPaymentComponent {


  CustomerForm: FormGroup;
  customer: CustomerPaymentInterface[] = [];
  dataSource = new MatTableDataSource<CustomerPaymentInterface>([]);
  searchValue: string = '';
  isUsingTestData: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'transactionId', 'customerName', 'paymentMethod', 'transactionAmount', 'discountAmount', 'transactionDate', 'view'
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog, private customerPaymentService: CustomerPaymentService) {
    this.CustomerForm = this.fb.group({
      transactionId: 0,
      CustomerId: [null],
      vendorName: [''],
      customerName: [''],
      transactionDate: [new Date()],
      transactionAmount: [null],
      paymentMethod: [''],
      paymentMethodNo: [''],
      paymentMethodBank: [''],
      paymentMethodChequeDate: [null],
      amountInWords: [''],
      discountAmount: [null],
      notes: [''],
      createdById: [null],
      createdDate: [null],
      companyId: [null]
    });

    this.fetchCustomers();
  }


  fetchCustomers() {
    this.customerPaymentService.getCustomerPayment()
      .pipe(
        timeout(15000),
        catchError(err => {
          console.error('Fetch customers failed or timed out:', err);
          return of({ data: [] });
        })
      )
      .subscribe((data: any) => {
        this.dataSource.data = data.data || data || [];
        if (this.paginator) this.dataSource.paginator = this.paginator;
      });
  }

  ngAfterViewInit() { if (this.paginator) this.dataSource.paginator = this.paginator; }

  applyFilter() { this.fetchCustomers(); this.dataSource.filter = this.searchValue.trim().toLowerCase(); }

  openNewVendorDialog(): void {
    const emptyVendor = {
      transactionId: 0,
      customerId: [null],
      customerName: [''],
      transactionDate: [new Date()],
      transactionAmount: [null],
      paymentMethod: [''],
      paymentMethodNo: [''],
      paymentMethodBank: [''],
      paymentMethodChequeDate: [null],
      amountInWords: [''],
      discountAmount: [null],
      notes: [''],
      createdById: [null],
      createdDate: [null],
      companyId: [null]
    };

    this.blurActiveElement();

    const dialogRef = this.dialog.open(CustomerPaymentDialogComponent, {
      width: '700px',
      data: {
        vendor: emptyVendor
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved' || result === 'deleted') {
        if (!this.isUsingTestData) {
          this.fetchCustomers();
        }
      }
    });
  }


  viewCustomer(customer: CustomerPaymentInterface) {
    //debugger
    this.customerPaymentService.getCustomerPaymentById(customer.companyId, TransactionType.Customer, customer.transactionId).subscribe({
      next: (response: any) => {

        const fetched = response && response.data ? response.data : response;
        // Normalize vendor payload: API may return an array or a single object
        const vendorToOpen = Array.isArray(fetched) ? fetched[0] : fetched;
        console.log('-----------------' + fetched);

        this.blurActiveElement();
        const dialogRef = this.dialog.open(CustomerPaymentDialogComponent, { data: { customer: vendorToOpen }, width: '700px' });
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'saved' || result === 'deleted') {
            if (!this.isUsingTestData) this.fetchCustomers();
          }
        });
      }, error: (err: any) => console.error('Fetch by ID failed', err)
    });
  }

  confirmDeleteCustomer(customer: CustomerPaymentInterface): void {
    this.blurActiveElement();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Customer Payment',
        message: `Are you sure you want to delete customer payment '${customer.customerName}'?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.customerPaymentService
          .deleteCustomerPayment(customer.transactionId, customer.companyId)
          .subscribe(() => {
            this.fetchCustomers();
          });
      }
    });
  }

  private blurActiveElement(): void {
    try {
      const ae = (typeof document !== 'undefined') ? (document.activeElement as HTMLElement | null) : null;
      if (ae && typeof ae.blur === 'function') {
        ae.blur();
      }
    } catch (e) {
      // ignore
    }
  }
}
enum TransactionType {
  Farmer = 1,
  Customer = 2,
}
