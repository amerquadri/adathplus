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
import { HttpClientModule } from '@angular/common/http';
import { VendorService, Vendor } from '../vendor-page/vendor.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../customer-page/confirm-dialog.component';
import { VendorDialogComponent } from '../vendor-page/vendor-dialog.component';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-vendor-page-test',
  standalone: true,
  imports: [MasterPageComponent, ReactiveFormsModule, FormsModule, MatInputModule,
    MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatDialogModule, MatTableModule, MatSortModule, MatPaginatorModule,
    CommonModule, HttpClientModule],
  templateUrl: './vendor-page-test.component.html',
  styleUrls: ['./vendor-page-test.component.css']
})
export class VendorPageTestComponent {
  // expose dialog components for ngComponentOutlet
  public VendorDialog = VendorDialogComponent;
  public ConfirmDialog = ConfirmDialogComponent;

  vendorForm: FormGroup;
  vendors: Vendor[] = [];
  dataSource = new MatTableDataSource<Vendor>([]);
  searchValue: string = '';
  isUsingTestData: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'vendorId', 'vendorName', 'credit', 'debit', 'openingAmt', 'isActive', 'view'
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog, private vendorService: VendorService) {
    this.vendorForm = this.fb.group({
      vendorId: [null],
      vendorName: ['', Validators.required],
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

  viewVendor(vendor: Vendor) {
    this.vendorService.getVendorById(vendor.vendorId).subscribe({
      next: (response: any) => {
        const fetched = response && response.data ? response.data : response;
        const vendorToOpen = Array.isArray(fetched) ? fetched[0] : fetched;
        this.blurActiveElement();
        const dialogRef = this.dialog.open(VendorDialogComponent, { data: { vendor: vendorToOpen }, width: '700px' });
        dialogRef.afterClosed().subscribe(result => { if (result === 'saved' || result === 'deleted') { if (!this.isUsingTestData) this.fetchVendors(); } });
      }, error: (err: any) => console.error('Fetch by ID failed', err)
    });
  }

  generateTemporaryVendors() {
    this.vendors = Array.from({ length: 100 }, (_, i) => ({ vendorId: i+1, vendorName: `Vendor ${i+1}`, phone1: `123456789${i%10}`, phone2: `987654321${i%10}`, email: `vendor${i+1}@example.com`, address: `Address ${i+1}`, detail: `Detail ${i+1}`, credit: Math.floor(Math.random()*10000), debit: Math.floor(Math.random()*5000), openingAmt: Math.floor(Math.random()*2000), createdById:1, createdDate: new Date().toISOString(), updatedById:1, updatedDate: new Date().toISOString(), isActive: true, companyId:1 }));
    this.dataSource.data = this.vendors; this.isUsingTestData = true; if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() { if (this.paginator) this.dataSource.paginator = this.paginator; }

  applyFilter() { this.fetchVendors(); this.dataSource.filter = this.searchValue.trim().toLowerCase(); }

  confirmDeleteVendor(vendor: Vendor) {
    this.blurActiveElement();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '350px', data: { title: 'Delete Vendor', message: `Are you sure you want to delete vendor '${vendor.vendorName}'?` } });
    dialogRef.afterClosed().subscribe(result => { if (result === 'confirm') { this.vendorService.deleteVendor(vendor.vendorId).subscribe(() => this.fetchVendors()); } });
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
