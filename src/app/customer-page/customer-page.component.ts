import { MasterPageComponent } from '../master-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CustomerService, Customer } from './customer.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { CustomerDialogComponent } from './customer-dialog.component';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-customer-page',
  standalone: true,
  imports: [
  MasterPageComponent,
  ReactiveFormsModule,
  FormsModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDialogModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  DatePipe,
  CommonModule,
  MatIcon,
  MatTooltipModule,
  MatChipsModule,
  HttpClientModule
  ],
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CustomerPageComponent {
  customerForm: FormGroup;
  customers: Customer[] = [];
  dataSource = new MatTableDataSource<Customer>([]);
  searchValue: string = '';
  expandedElement: Customer | null = null;
  isUsingTestData: boolean = false; // Track if we're using test data
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'expand', 'customerId', 'customerName', 'phone1', 'email', 'isActive', 'view'
  ];

  // Computed property for paginated data
  get paginatedData(): Customer[] {
    if (!this.paginator) {
      return this.dataSource.filteredData;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    return this.dataSource.filteredData.slice(startIndex, endIndex);
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog, private customerService: CustomerService) {
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
    
    // Only generate test data if explicitly needed (removed automatic generation)
    console.log('Customer component initialized. Check console for API debugging info.');
    console.log('If no data appears, click the "Generate Test Data" button or check your API server.');

  }


fetchCustomers() {
  console.log('Fetching customers from API...');
  console.log('API URL:', this.customerService['apiUrl']); // Log the API URL being used
  
  this.customerService.getCustomers()
    .pipe(
      timeout(15000), // Increased timeout to 15 seconds
      catchError(err => {
        console.error('API Error Details:', err);
        console.error('Error Status:', err.status);
        console.error('Error Message:', err.message);
        console.error('Full Error Object:', err);
        
        // If using test data, don't override it
        if (!this.isUsingTestData) {
          console.log('API failed, returning empty data');
          return of({ data: [] });
        }
        console.log('API failed but preserving test data');
        return of({ data: this.dataSource.data });
      })
    )
    .subscribe((data: any) => {
      console.log('API Response received:', data);
      console.log('Response type:', typeof data);
      console.log('Is array?', Array.isArray(data));
      
      // Handle different API response formats
      let customerData = [];
      
      if (Array.isArray(data)) {
        // Direct array response
        customerData = data;
        console.log('Using direct array response');
      } else if (data && data.data && Array.isArray(data.data)) {
        // Nested data property
        customerData = data.data;
        console.log('Using nested data property');
      } else if (data && Array.isArray(data.customers)) {
        // Different property name
        customerData = data.customers;
        console.log('Using customers property');
      }
      
      console.log('Processed customer data:', customerData);
      console.log('Customer count:', customerData.length);
      
      if (customerData && customerData.length > 0) {
        this.dataSource.data = customerData;
        this.customers = customerData;
        this.isUsingTestData = false;
        console.log('✅ Successfully loaded real customer data from API');
        console.log('First customer:', customerData[0]);
      } else if (!this.isUsingTestData) {
        console.log('❌ No customer data received from API');
        this.dataSource.data = [];
      } else {
        console.log('🔄 Keeping existing test data');
      }
      
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
}


  openCustomerDialog() {
    this.blurActiveElement();
    this.dialog.open(CustomerDialogComponent, {
      data: { form: this.customerForm },
      width: '700px'
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
        // Only refresh from API if we're not using test data
        if (!this.isUsingTestData) {
          this.fetchCustomers(); // Refresh data after save or delete
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
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;
      this.customerService.insertCustomer(customer).subscribe({
        next: (result: any) => {
          this.customers.push(result);
          this.dataSource.data = [...this.customers];
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
      },
      error: (err: any) => {
        console.error('Delete failed', err);
      }
    });
  }

  // Generate 100 temporary customer records
  generateTemporaryCustomers() {
  console.log('Generating temporary customer data...');
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
    console.log('Test data generated, total records:', this.customers.length);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Listen to paginator changes to trigger view updates
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        // Reset expanded element when changing pages
        this.expandedElement = null;
      });
    }
  }

  applyFilter(event?: Event) {
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      // Only fetch customers if we're not using test data
      if (!this.isUsingTestData) {
        this.fetchCustomers();
      }
      this.dataSource.filter = this.searchValue.trim().toLowerCase();
    }
    
    // Reset pagination to first page after filtering
    if (this.paginator) {
      this.paginator.firstPage();
    }
    
    // Reset expanded element when filtering
    this.expandedElement = null;
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
        // Only refresh from API if we're not using test data
        if (!this.isUsingTestData) {
          this.fetchCustomers(); // Refresh data after delete
        }
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

  // Export to Excel functionality
  exportToExcel() {
    try {
      const data = this.dataSource.data;
      if (data.length === 0) {
        alert('No data to export');
        return;
      }

      // Prepare data for export
      const exportData = data.map(customer => ({
        'Customer ID': customer.customerId,
        'Customer Name': customer.customerName,
        'Phone 1': customer.phone1,
        'Phone 2': customer.phone2,
        'Email': customer.email,
        'Address': customer.address,
        'Detail': customer.detail,
        'Credit': customer.credit,
        'Debit': customer.debit,
        'Opening Amount': customer.openingAmt,
        'Created By': customer.createdById,
        'Created Date': customer.createdDate ? new Date(customer.createdDate).toLocaleDateString() : '',
        'Updated By': customer.updatedById,
        'Updated Date': customer.updatedDate ? new Date(customer.updatedDate).toLocaleDateString() : '',
        'Active': customer.isActive ? 'Yes' : 'No',
        'Company ID': customer.companyId
      }));

      // Convert to CSV format
      const csv = this.convertToCSV(exportData);
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Excel export completed');
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Export failed. Please try again.');
    }
  }

  // Export to PDF functionality
  exportToPDF() {
    try {
      const data = this.dataSource.data;
      if (data.length === 0) {
        alert('No data to export');
        return;
      }

      // Create HTML content for PDF
      const htmlContent = this.generatePDFContent(data);
      
      // Create a new window for printing
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load then print
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }

      console.log('PDF export completed');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Export failed. Please try again.');
    }
  }

  // Helper method to convert data to CSV
  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        return `"${val || ''}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  // Helper method to generate PDF HTML content
  private generatePDFContent(data: Customer[]): string {
    const currentDate = new Date().toLocaleDateString();
    
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Customer List Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #1976d2; margin-bottom: 5px; }
          .header p { margin: 5px 0; color: #666; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Customer List Report</h1>
          <p>Generated on: ${currentDate}</p>
          <p>Total Records: ${data.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone 1</th>
              <th>Email</th>
              <th>Address</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Opening Amount</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>`;

    data.forEach(customer => {
      htmlContent += `
        <tr>
          <td>${customer.customerId || ''}</td>
          <td>${customer.customerName || ''}</td>
          <td>${customer.phone1 || ''}</td>
          <td>${customer.email || ''}</td>
          <td>${customer.address || ''}</td>
          <td>${customer.credit || 0}</td>
          <td>${customer.debit || 0}</td>
          <td>${customer.openingAmt || 0}</td>
          <td>${customer.isActive ? 'Yes' : 'No'}</td>
        </tr>`;
    });

    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          <p>This report was generated automatically by the Customer Management System</p>
        </div>
      </body>
      </html>`;

    return htmlContent;
  }

  // Expandable row functionality
  toggleRow(customer: Customer) {
    console.log('Toggle row for customer:', customer.customerId);
    this.expandedElement = this.expandedElement === customer ? null : customer;
    console.log('Expanded element:', this.expandedElement?.customerId || 'none');
  }

  // Function to identify regular rows (not expanded detail rows)
  isRegularRow = (index: number, customer: Customer): boolean => {
    return true; // All rows are regular rows, expanded rows are handled separately
  };

  // Track by function for ngFor
  trackByCustomerId(index: number, customer: Customer): number {
    return customer.customerId;
  }

  // Function to determine if row is a data row (not detail row)
  isDataRow = (index: number, item: any): boolean => {
    return true; // All rows in dataSource are data rows
  };

  // Force refresh from API (for debugging)
  forceRefreshFromAPI() {
    console.log('🔄 Force refreshing from API...');
    this.isUsingTestData = false;
    this.dataSource.data = [];
    this.fetchCustomers();
  }

  // Test API connection
  testAPIConnection() {
    console.log('🧪 Testing API connection...');
    const apiUrl = 'http://localhost:29033/Customer/GetCustomerList?CompanyId=10001';
    console.log('Testing URL:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        console.log('✅ API Response Status:', response.status);
        console.log('✅ API Response OK:', response.ok);
        return response.json();
      })
      .then(data => {
        console.log('✅ API Response Data:', data);
        alert(`API Connection Successful! Received ${Array.isArray(data) ? data.length : 'unknown'} records.`);
      })
      .catch(error => {
        console.error('❌ API Connection Failed:', error);
        alert(`API Connection Failed: ${error.message}\n\nPlease check:\n1. Is your API server running on http://localhost:29033?\n2. Is CORS enabled on your API?\n3. Check browser network tab for more details.`);
      });
  }
}


// ...existing code...
