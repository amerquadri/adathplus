import { Component, Inject, inject } from '@angular/core';
import { MasterPageComponent } from '../master-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, CommonModule, DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CustomerService, Customer } from '../customer-page/customer.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../customer-page/confirm-dialog.component';
import { CustomerDialogComponent } from '../customer-page/customer-dialog.component';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-master',
  standalone: true,
  imports: [MasterPageComponent, ReactiveFormsModule, FormsModule, MatInputModule,
    MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatDialogModule, MatTableModule, MatSortModule, MatPaginatorModule,
     CommonModule, DecimalPipe, MatIconModule, MatTooltipModule],
  templateUrl: './customer-master.component.html',
  styleUrl: './customer-master.component.css'
})
export class CustomerMasterComponent {
  // Expose dialog component classes to template for ngComponentOutlet if needed
  public CustomerDialog = CustomerDialogComponent;
  public ConfirmDialog = ConfirmDialogComponent;
  public Math = Math; // For template usage
  customerForm: FormGroup;
  customers: Customer[] = [];
  dataSource = new MatTableDataSource<Customer>([]);
  searchValue: string = '';
  isUsingTestData: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'customerId', 'customerName',
    'credit', 'debit', 'openingAmt', 'isActive', 'view'
  ];

  // Mobile pagination properties
  mobilePageIndex: number = 0;
  mobilePageSize: number = 5;
  mobilePageSizeOptions: number[] = [5, 10, 20, 50];

  //'companyId','phone1', 'phone2', 'email', 'address', 'detail','createdById', 'createdDate', 'updatedById', 'updatedDate',
  constructor(private fb: FormBuilder, private dialog: MatDialog, private customerService: CustomerService,private snackBar: MatSnackBar) {
    this.customerForm = this.fb.group({
      customerId: [null],
      customerName: ['', Validators.required],
      phone1: [''],
      phone2: [''],
      email: [''],
      address: [''],
      detail: [''],
      credit: [null],
      debit: [null],
      openingAmt: [null],
      createdById: [null],
      createdDate: [null],
      updatedById: [null],
      updatedDate: [null],
      isActive: [null],
      companyId: [null]
    });

    this.fetchCustomers();
  }



  fetchCustomers() {
    this.customerService.getCustomers()
      .pipe(
        timeout(15000), // 15 seconds timeout
        catchError(err => {
          console.error('Fetch customers failed or timed out:', err);
          return of({ data: [] });
        })
      )
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  openCustomerDialog() {
    this.blurActiveElement();
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: { form: this.customerForm },
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved' || result === 'deleted') {
        // Refresh grid from API unless we're using test data
        if (!this.isUsingTestData) {
          this.fetchCustomers();
        }
      }
    });
  }


  openNewCustomerDialog() {
    const emptyCustomer = {
      customerId: null,
      customerName: '',
      phone1: '',
      phone2: '',
      email: '',
      address: '',
      detail: '',
      credit: null,
      debit: null,
      openingAmt: null,
      createdById: null,
      createdDate: '',
      updatedById: null,
      updatedDate: '',
      isActive: true,
      companyId: null
    };
    this.blurActiveElement();
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: { customer: emptyCustomer },
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved' || result === 'deleted') {
        if (!this.isUsingTestData) {
          this.fetchCustomers();
        }
      }
    });
  }


  // Modified viewCustomer to fetch by id and show dialog with fetched data
  viewCustomer(customer: Customer) {
    this.customerService.getCustomerById(customer.customerId).subscribe({
      next: (response: any) => {
        // Handle both direct and nested API responses
        const fetchedCustomer = response.data ? response.data : response;
        console.log('Fetched customer:', fetchedCustomer[0]);
        this.blurActiveElement();
        const dialogRef = this.dialog.open(CustomerDialogComponent, {
          data: { customer: fetchedCustomer[0] },
          width: '700px'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'saved' || result === 'deleted') {
            // Only refresh from API if we're not using test data
            if (!this.isUsingTestData) {
              this.fetchCustomers(); // Refresh data after save or delete
            }
          }
        });
      },
      error: (err: any) => {
        console.error('Fetch by ID failed', err);
      }
    });
  }



  onSubmit() {
    if (this.customerForm.valid) {
      // Handle form submission
      console.log(this.customerForm.value);
    }
  }



  // Call insert customer service
  insertCustomer() {
     const customer: Customer = this.customerForm.value;
    
  if(customer.customerName.length < 3) {
     this.snackBar.open('Customer name must be at least 3 characters long.', 'Close', {
       duration: 3000,verticalPosition: 'top',
    });
    return;
  }
  if(customer.credit < 0 || customer.debit < 0 || customer.openingAmt < 0  
    || customer.credit ==null || customer.debit == null || customer.openingAmt == null
  ) {
     this.snackBar.open('Amounts cannot be negative.', 'Close', {
       duration: 3000,verticalPosition: 'top',
    });
    return;
  }

    if (this.customerForm.valid) {
      this.customerService.insertCustomer(customer).subscribe({
        next: (result: any) => {
          this.customers.push(result);
          this.dataSource.data = [...this.customers];
          this.fetchCustomers();
        },
        error: (err: any) => {
          console.error('Insert failed', err);
        }
      });
    }
  }



  // Call update customer service
  updateCustomer(customerId: number) {
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;

      this.customerService.updateCustomer(customer).subscribe({
        next: (result: any) => {
          const idx = this.customers.findIndex(c => c.customerId === customerId);
          if (idx > -1) this.customers[idx] = result;
          this.dataSource.data = [...this.customers];
          this.fetchCustomers();
        },
        error: (err: any) => {
          console.error('Update failed', err);
        }
      });
    }
  }




  // Call delete customer service
  deleteCustomer(customerId: number) {
    this.customerService.deleteCustomer(customerId).subscribe({
      next: () => {
        this.customers = this.customers.filter(c => c.customerId !== customerId);
        this.dataSource.data = [...this.customers];
        this.fetchCustomers();
      },
      error: (err: any) => {
        console.error('Delete failed', err);
      }
    });
  }



  // Generate 100 temporary customer records
  generateTemporaryCustomers() {
    this.customers = Array.from({ length: 100 }, (_, i) => ({
      customerId: i + 1,
      customerName: `Customer ${i + 1}`,
      phone1: `123456789${i % 10}`,
      phone2: `987654321${i % 10}`,
      email: `customer${i + 1}@example.com`,
      address: `Address ${i + 1}`,
      detail: `Detail for customer ${i + 1}`,
      credit: Math.floor(Math.random() * 10000),
      debit: Math.floor(Math.random() * 5000),
      openingAmt: Math.floor(Math.random() * 2000),
      createdById: 1,
      createdDate: new Date().toISOString(),
      updatedById: 1,
      updatedDate: new Date().toISOString(),
      isActive: true,
      companyId: 1
    }));
    this.dataSource.data = this.customers;
    this.isUsingTestData = true;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Mobile pagination methods
  get paginatedMobileData(): Customer[] {
    const filtered = this.dataSource.filteredData;
    const startIndex = this.mobilePageIndex * this.mobilePageSize;
    return filtered.slice(startIndex, startIndex + this.mobilePageSize);
  }

  get totalMobilePages(): number {
    return Math.ceil(this.dataSource.filteredData.length / this.mobilePageSize);
  }

  onMobilePageChange(event: any): void {
    this.mobilePageIndex = event.pageIndex;
    this.mobilePageSize = event.pageSize;
  }

  applyFilter() {
    this.dataSource.filter = this.searchValue.trim().toLowerCase();
    
    // Reset to first page after filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    
    // Reset mobile pagination as well
    this.mobilePageIndex = 0;
  }

  // Call getCustomerById service
  getCustomerById(customerId: number) {
    this.customerService.getCustomerById(customerId).subscribe({
      next: (customer: Customer) => {
        // You can handle the customer object here, e.g., show in dialog or set to form
        console.log('Fetched customer:', customer);
        // Example: patch form with customer data
        this.customerForm.patchValue(customer);
      },
      error: (err: any) => {
        console.error('Fetch by ID failed', err);
      }
    });
  }

  confirmDeleteCustomer(customer: Customer) {
    this.blurActiveElement();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Customer',
        message: `Are you sure you want to delete customer '${customer.customerName}'?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteCustomer(customer.customerId);
        const idx = this.customers.findIndex(c => c.customerId === customer.customerId);
        if (idx > -1) this.customers[idx] = result;
        this.dataSource.data = [...this.customers];
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
