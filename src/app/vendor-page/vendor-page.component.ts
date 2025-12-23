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
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VendorService } from './vendor.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../customer-page/confirm-dialog.component';
import { VendorDialogComponent } from './vendor-dialog.component';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// import { VendorPaymentInterface } from '../vendor-payment/vendor-payment-interface';
import { VendorInterface } from '../vendor-payment/vendor-payment-interface';

@Component({
  selector: 'app-vendor-page',
  standalone: true,
  imports: [MasterPageComponent, ReactiveFormsModule, FormsModule, MatInputModule,
    MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatDialogModule, MatTableModule, MatSortModule, MatPaginatorModule,
    CommonModule, HttpClientModule],
  templateUrl: './vendor-page.component.html',
  styleUrls: ['./vendor-page.component.css']
})
export class VendorPageComponent {
  // expose dialog classes for ngComponentOutlet
  public VendorDialog = VendorDialogComponent;
  public ConfirmDialog = ConfirmDialogComponent;

  vendorForm: FormGroup;
  vendors: VendorInterface[] = [];
  dataSource = new MatTableDataSource<VendorInterface>([]);
  searchValue: string = '';
  isUsingTestData: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'vendorId', 'vendorName', 'credit', 'debit', 'openingAmt', 'isActive', 'view'
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog, private vendorService: VendorService) {
    this.vendorForm = this.fb.group({
      vendorId: [null],
      vendorName: [''],
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

    this.fetchVendors();
  }

  fetchVendors() {
    this.vendorService.getVendors()
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

  openVendorDialog() {
    this.blurActiveElement();
    const dialogRef = this.dialog.open(VendorDialogComponent, { data: { form: this.vendorForm }, width: '700px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved' || result === 'deleted') {
        if (!this.isUsingTestData) this.fetchVendors();
      }
    });
  }

  openNewVendorDialog() {
    const emptyVendor = { vendorId: null, vendorName: '', phone1: '', phone2: '', email: '', address: '', detail: '', credit: null, debit: null, openingAmt: null, createdById: null, createdDate: '', updatedById: null, updatedDate: '', isActive: true, companyId: null };
    this.blurActiveElement();
    const dialogRef = this.dialog.open(VendorDialogComponent, { data: { vendor: emptyVendor }, width: '700px' });
    dialogRef.afterClosed().subscribe(result => { if (result === 'saved' || result === 'deleted') { if (!this.isUsingTestData) this.fetchVendors(); } });
  }

  viewVendor(vendor: VendorInterface) {
    this.vendorService.getVendorById(vendor.vendorId).subscribe({
      next: (response: any) => {
        const fetched = response && response.data ? response.data : response;
        // Normalize vendor payload: API may return an array or a single object
        const vendorToOpen = Array.isArray(fetched) ? fetched[0] : fetched;
        this.blurActiveElement();
        const dialogRef = this.dialog.open(VendorDialogComponent, { data: { vendor: vendorToOpen }, width: '700px' });
        dialogRef.afterClosed().subscribe(result => { if (result === 'saved' || result === 'deleted') { if (!this.isUsingTestData) this.fetchVendors(); } });
      }, error: (err: any) => console.error('Fetch by ID failed', err)
    });
  }

  

  ngAfterViewInit() { if (this.paginator) this.dataSource.paginator = this.paginator; }

  applyFilter() { this.fetchVendors(); this.dataSource.filter = this.searchValue.trim().toLowerCase(); }

  confirmDeleteVendor(vendor: VendorInterface): void {
    this.blurActiveElement();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Vendor',
        message: `Are you sure you want to delete vendor '${vendor.vendorName}'?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.vendorService
          .deleteVendor(vendor.vendorId)
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
