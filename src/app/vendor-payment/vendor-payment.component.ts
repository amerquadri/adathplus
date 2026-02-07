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
import { VendorPaymentInterface } from '../vendor-payment/vendor-payment-interface';
import { VendorPaymentServiceService } from './vendor-payment-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../customer-page/confirm-dialog.component';
import { VendorDialogComponent } from '../vendor-page/vendor-dialog.component';
import{ VendorPaymentDialogComponent } from './vendor-payment-dialog/vendor-payment-dialog.component';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatIcon } from '@angular/material/icon';



@Component({
  selector: 'app-vendor-payment',
  standalone: true,
   imports: [MasterPageComponent, ReactiveFormsModule, FormsModule, MatInputModule,
    MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatDialogModule, MatTableModule, MatSortModule, MatPaginatorModule,MatIcon,
    CommonModule ],
  templateUrl: './vendor-payment.component.html',
  styleUrl: './vendor-payment.component.css'
})
export class VendorPaymentComponent {



  vendorForm: FormGroup;
  vendors: VendorPaymentInterface[] = [];
  dataSource = new MatTableDataSource<VendorPaymentInterface>([]);
  searchValue: string = '';
  isUsingTestData: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'transactionId', 'vendorName', 'paymentMethod', 'transactionAmount', 'discountAmount', 'transactionDate', 'view'
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog, private vendorpaymentService: VendorPaymentServiceService) {
    this.vendorForm = this.fb.group({
          
      transactionId: 0,
      vendorId: [null],
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

    this.fetchVendors();
  }



  fetchVendors() {
    this.vendorpaymentService.getVendorPayment()
      .pipe(
        timeout(15000),
        catchError(err => {
          console.error('Fetch vendors failed or timed out:', err);
          return of({ data: [] });
        })
      )
      .subscribe((data: any) => {
        this.dataSource.data = data.data || data || [];
        if (this.paginator) this.dataSource.paginator = this.paginator;
      });
  }



 
  ngAfterViewInit() { if (this.paginator) this.dataSource.paginator = this.paginator; }

  applyFilter() { this.fetchVendors(); this.dataSource.filter = this.searchValue.trim().toLowerCase(); }

openNewVendorDialog(): void {
  const emptyVendor = {
  
      transactionId: 0,
      vendorId: [null],
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
  };

  this.blurActiveElement();

  const dialogRef = this.dialog.open(VendorPaymentDialogComponent, {
    width: '700px',
    data: {
      vendor: emptyVendor
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'saved' || result === 'deleted') {
      if (!this.isUsingTestData) {
        this.fetchVendors();
      }
    }
  });
}


  viewVendor(vendor: VendorPaymentInterface) {
    this.vendorpaymentService.getVendorPaymentById(vendor.companyId,TransactionType.Farmer,  vendor.transactionId).subscribe({
      next: (response: any) => {
        const fetched = response && response.data ? response.data : response;
        // Normalize vendor payload: API may return an array or a single object
        const vendorToOpen = Array.isArray(fetched) ? fetched[0] : fetched;
        this.blurActiveElement();
        const dialogRef = this.dialog.open(VendorPaymentDialogComponent, { data: { vendor: vendorToOpen }, width: '700px' });
        dialogRef.afterClosed().subscribe(result => { if (result === 'saved' || result === 'deleted') { if (!this.isUsingTestData) this.fetchVendors(); } });
      }, error: (err: any) => console.error('Fetch by ID failed', err)
    });
  }

  confirmDeleteVendor(vendor: VendorPaymentInterface): void {
    this.blurActiveElement();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Vendor Payment',
        message: `Are you sure you want to delete vendor payment '${vendor.customerName}'?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.vendorpaymentService
          .deleteVendorPayment(vendor.transactionId, vendor.companyId)
          .subscribe(() => {
            this.fetchVendors();
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