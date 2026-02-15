import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MasterPageComponent } from "../master-page.component";
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerbillService } from './customerbill.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListofValuesService } from '../list-of-values/listof-values.service';
import { MatDialog } from '@angular/material/dialog';
import { SaleAmt, SaleDetails } from '../customer-bill/customerbill';
import { Customer } from '../customer-page/customer.service';
import { catchError, map, Observable, of, startWith, timeout } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { error } from 'console';
import { MatTable } from '@angular/material/table';
import { HeaderComponent } from '../header/header.component';
import { farmerBill, FarmerBillModel } from '../farmer-bill/farmer-bill-interface';
import { VendorInterface } from '../vendor-payment/vendor-payment-interface';
import { FarmerBillService } from '../farmer-bill/farmer-bill.service';
import { ConfirmDialogComponent } from '../customer-page/confirm-dialog.component';

@Component({
  selector: 'app-customer-bill',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    CdkTableModule,
    MasterPageComponent,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatTable
  ],
  templateUrl: './customer-bill.component.html',
  styleUrls: ['./customer-bill.component.css'],
})
export class CustomerBillComponent implements AfterViewInit {

  optionsCustomer: string[] = [];
  optionsFarmer: string[] = [];
  optionsFarmerBill: string[] = [];
  optionsFarmers: string[] = [];
  optionsParticular: string[] = [];
  customerListddl = new FormControl('');
  farmerbilldateddl = new FormControl('');
  farmerListddl = new FormControl('');
  particularListddl = new FormControl('');
  farmerBillddl = new FormControl('');

  filteredOptionsCustomer: Observable<string[]> = of([]);
  filteredOptionsFarmer: Observable<string[]> = of([]);
  filteredOptionsFarmers: Observable<string[]> = of([]);
  filteredOptionsParticular: Observable<string[]> = of([]);
  filteredOptionsFarmerBill: Observable<string[]> = of([]);
  public saleAmt: SaleAmt = {} as SaleAmt;
  public saleDetails: SaleDetails[] = [];
  public saleDetailsobj: SaleDetails = {} as SaleDetails;


  dataSource = new MatTableDataSource<SaleDetails>([]);
  selectedCustomerId: any = null;
  selectedFarmerId: any = null;
  selectedDateFarmerId: any = null;
  selectedParticular: string = '';
  public customerList: Customer[] = [];
  public farmerList: VendorInterface[] = [];
  public farmerbilldateddlList: farmerBill[] = [];
  public selectedComissionBillId: number | null = null;
  public _farmerbill: farmerBill = {} as farmerBill;


  displayedColumns: string[] = ['sr',
      'customerName', 'particularName', 'customerBillDate', 'qty', 'unit', 'weight', 'rate', 'comissionPercent', 'comissionAmt', 'taxAmt', 'amt', 'view'
  ];


  @ViewChild(MasterPageComponent) masterPage!: MasterPageComponent;

  constructor(private dialog: MatDialog,
    private customerbillService: CustomerbillService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private lovService: ListofValuesService
    , private farmerBillService: FarmerBillService
  ) {

    this.GetCustomerBillDetails();
    this.getCustomerNameListddl();
    this.getFarmerBillDateListddl();
    this.getFarmerListddl();
    this.getParticularOptions();
  }

  ngAfterViewInit(): void {
    if (this.masterPage && this.masterPage.headerComponent) {
      this.masterPage.headerComponent.formname = 'Customer Bill';
    } else if (this.masterPage) {
      this.masterPage.formname = 'Customer Bill';
    }
  }


  ngOnInit(): void {
    this.filteredOptionsFarmer = this.farmerbilldateddl.valueChanges.pipe(
      startWith(''), map(value => this._filterFarmer(value || '')),
    );
    this.filteredOptionsCustomer = this.customerListddl.valueChanges.pipe(
      startWith(''), map(value => this._filterCustomer(value || '')),
    );
    this.filteredOptionsFarmers = this.farmerListddl.valueChanges.pipe(
      startWith(''), map(value => this._filterVendor(value || '')),
    );
    this.filteredOptionsParticular = this.particularListddl.valueChanges.pipe(
      startWith(''), map(value => this._filterParticular(value || '')),
    );
    this.filteredOptionsFarmerBill = this.farmerBillddl.valueChanges.pipe(
      startWith(''), map(value => this._filterFarmerBill(value || '')),
    );

  }


  getTotalCost() {
    const arr = (this.dataSource && Array.isArray(this.dataSource.data) ? this.dataSource.data : this.saleDetails || []);
    return arr.map(t => Number(t.amt || 0)).reduce((acc, value) => acc + value, 0);
  }

  getTotalQty() {
    const arr = (this.dataSource && Array.isArray(this.dataSource.data) ? this.dataSource.data : this.saleDetails || []);
    return arr.map(t => Number(t.qty || 0)).reduce((acc, value) => acc + value, 0);
  }
  getTotalWeight() {    
    const arr = (this.dataSource && Array.isArray(this.dataSource.data) ? this.dataSource.data : this.saleDetails || []);
    return arr.map(t => Number(t.weight || 0)).reduce((acc, value) => acc + value, 0);
  }

  onView(saleDetails: SaleDetails) {
    console.log('View sale details:', saleDetails);
    // placeholder: implement dialog/navigation as needed
  }


  GetCustomerBillDetails() {
    
    if (this.selectedComissionBillId !== null && this.selectedComissionBillId !== undefined && this.selectedComissionBillId > 0) {
      this.customerbillService.GetCustomerBillDetails(this.selectedComissionBillId).subscribe({
        next: (data: any) => {
          this.dataSource.data = data.data || data || [];
          // if (this.paginator) this.dataSource.paginator = this.paginator;
          console.log('Customer Bill Details fetched:', this.dataSource.data, 'records');
        },
        error: (err: any) => {
          console.error('Fetch vendors failed:', err);
        }
      });
    } else {
      this.snackBar.open('Please select Farmer Bill', 'Close', {
        duration: 3000,
      });
    }
  }

  getFarmerBillDateListddl() {
    this.farmerBillService.getFarmerBillDateList(this._farmerbill)
      .pipe(
        timeout(15000), // 15 seconds timeout
        catchError(err => {
          console.error('Fetch customers failed or timed out:', err);
          // return an empty array so subscriber can treat response uniformly
          return of([]);
        })
      ).subscribe((resp: any) => {
        // Normalize response: many APIs return { data: [...] } or plain array
        const dataList: any[] = Array.isArray(resp) ? resp : (resp && Array.isArray(resp.data) ? resp.data : []);
        this.farmerbilldateddlList = dataList;
        this.optionsFarmer = this.farmerbilldateddlList.map(v => (v.billDate ? new Date(v.billDate).toLocaleDateString('en-GB',
          { day: '2-digit', month: 'short', year: 'numeric' }) : '').trim());

        // Populate ComissionBillId dropdown values (deduplicated)
        this.optionsFarmerBill = Array.from(new Set(
          this.farmerbilldateddlList
            .map(v => (v.comissionBillId != null) ? v.comissionBillId.toString() : '')
            .filter(s => s !== '')
        ));

        // if valueChanges already set up, update filteredOptions so autocomplete shows suggestions
        this.filteredOptionsFarmer = of(this.optionsFarmer);
        this.filteredOptionsFarmerBill = of(this.optionsFarmerBill);
       // console.log('getFarmerBillDateList...........:', this.farmerbilldateddlList, 'items');
       // console.log('optionsFarmerBill...........:', this.optionsFarmerBill, 'items');
      },
        error => {
          console.error('Error loading customer list:', error);
        });
  }


  getCustomerNameListddl() {
    this.customerbillService.getCustomersNameList()
      .pipe(
        timeout(15000), // 15 seconds timeout
        catchError(err => {
          console.error('Fetch customers failed or timed out:', err);
          // return an empty array so subscriber can treat response uniformly
          return of([]);
        })
      ).subscribe((resp: any) => {
        // Normalize response: many APIs return { data: [...] } or plain array
        const dataList: any[] = Array.isArray(resp) ? resp : (resp && Array.isArray(resp.data) ? resp.data : []);
        this.customerList = dataList;
        this.optionsCustomer = this.customerList.map(v => (v.customerName || '').trim());
        // if valueChanges already set up, update filteredOptions so autocomplete shows suggestions
        this.filteredOptionsCustomer = of(this.optionsCustomer);
        console.log('Customer list loaded:', this.customerList.length, 'items');
      },
        error => {
          console.error('Error loading customer list:', error);
        });
  }

  getFarmerListddl() {
    this.farmerBillService.getVendors()
      .pipe(
        timeout(15000),
        catchError(err => {
          console.error('Fetch vendors failed or timed out:', err);
          return of([]);
        })
      ).subscribe((resp: any) => {
        const dataList: any[] = Array.isArray(resp) ? resp : (resp && Array.isArray(resp.data) ? resp.data : []);
        this.farmerList = dataList;
        this.optionsFarmers = this.farmerList.map(v => (v.vendorName || '').trim());
        this.filteredOptionsFarmers = of(this.optionsFarmers);
        //console.log('Vendor/farmer list loaded:', this.farmerList.length, 'items');
      }, error => {
        console.error('Error loading vendor list:', error);
      });
  }

  getParticularOptions() {
    this.lovService.getListOfValues().pipe(
      timeout(15000),
      catchError(err => {
        console.error('Fetch list-of-values failed or timed out:', err);
        return of([]);
      })
    ).subscribe((resp: any) => {
      const dataList: any[] = Array.isArray(resp) ? resp : (resp && Array.isArray(resp.data) ? resp.data : []);
      // Collect unique non-empty Name values; include both farmer and customer forms
      const names = (dataList || []).map(i => (i.Name || i.name || '').toString().trim()).filter(v => v !== '');
      this.optionsParticular = Array.from(new Set(names));
      this.filteredOptionsParticular = of(this.optionsParticular);
      //console.log('Particular options loaded:', this.optionsParticular.length);
    }, error => console.error('Error loading list-of-values for particulars', error));
  }

  private _filterFarmerBill(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsFarmerBill.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterCustomer(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsCustomer.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterFarmer(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsFarmer.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterVendor(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsFarmers.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterParticular(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsParticular.filter(option => option.toLowerCase().includes(filterValue));
  }

  onCustomerSelected(selectedName: string) {
    const target = (selectedName || '').trim();
    const found = this.customerList.find(v => (v.customerName || '').trim() === target);
    this.selectedCustomerId = found ? found.customerId : null;
    // you can use selectedCustomerId for form submission or further logic
    // alert(`Selected Customer ID: ${this.selectedCustomerId}`);
  }

  onFarmerDateSelected(selectedName: string) {
    const target = (selectedName || '').trim();
    const found = this.farmerbilldateddlList.find(v => (v.billDate?.toString() || '').trim() === target);
    this.selectedDateFarmerId = found ? found.farmerBillId : null;
    // you can use selectedCustomerId for form submission or further logic
    // alert(`Selected Customer ID: ${this.selectedCustomerId}`);
  }

  onFarmerNameSelected(selectedName: string) {
    const target = (selectedName || '').trim();
    const found = this.farmerList.find(v => (v.vendorName || '').trim() === target);
    this.selectedFarmerId = found ? found.vendorId : null;
    // you can use found.vendorId for later logic
    console.log('Selected farmer/vendor:', found);
  }

  onParticularSelected(selectedName: string) {
    this.selectedParticular = (selectedName || '').toString();
    console.log('Selected particular:', this.selectedParticular);
  }

  onFarmerBillSelected(selectedValue: string) {
    const target = (selectedValue || '').trim();
    const found = this.farmerbilldateddlList.find(v => ((v.comissionBillId || '').toString()).trim() === target);
    this.selectedComissionBillId = found ? (found.comissionBillId || null) : null;
    console.log('Selected farmer bill (ComissionBillId):', this.selectedComissionBillId, found);
  }

  EditCustomerBillDetails(saleDetails: SaleDetails) {
    if (!saleDetails) return;
    // copy values into the footer form object for editing
    this.saleDetailsobj = { ...saleDetails } as SaleDetails;
    // ensure date fields are proper Date instances
    if (this.saleDetailsobj.customerBillDate) {
      this.saleDetailsobj.customerBillDate = new Date(this.saleDetailsobj.customerBillDate as any);
    }
    // set selected customer and particular so autocompletes show current values
    const foundCustomer = this.customerList.find(c => c.customerId === (this.saleDetailsobj.customerId || 0));
    if (foundCustomer) {
      this.selectedCustomerId = foundCustomer.customerId;
      this.customerListddl.setValue((foundCustomer.customerName || '').trim());
      this.saleDetailsobj.customerBillId = foundCustomer.customerId || 0;
    } else {
      this.selectedCustomerId = null;
      this.customerListddl.setValue('');
      this.saleDetailsobj.customerBillId =   0;
    }

    this.selectedParticular = this.saleDetailsobj.particularName || '';
    // set selected commission bill id
    this.selectedComissionBillId = this.saleDetailsobj.comissionBillId || this.selectedComissionBillId;
    // log for debug
    console.log('Editing saleDetails:', this.saleDetailsobj);
  }

  DeleteCustomerBillDetails(saleDetailsId: number, customername: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the bill record for "${customername}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.customerbillService.DeleteCustomerBillDetails(saleDetailsId).subscribe({
          next: (data: any) => {
            this.snackBar.open('Customer Bill Detail deleted successfully - ' + customername, 'Close', {
              duration: 3000,
            });
            this.GetCustomerBillDetails();
          },
          error: (err: any) => {
            console.error('Delete Customer Bill Detail failed:', err);
            this.snackBar.open('Error deleting Customer Bill Detail', 'Close', {
              duration: 3000,
            });
          }
        });
      }
    });
  }


  InsertCustomerBill() {

    console.log('Inserting Customer Bill with details:', this.saleDetailsobj);
    console.log('Inserting Customer Bill with saleAmt:', this.saleAmt);
    this.saleDetailsobj.customerId = this.selectedCustomerId || 0;
    this.saleDetailsobj.comissionBillId = this.selectedComissionBillId || 0;
    this.saleDetailsobj.particularName = this.selectedParticular || '';
    this.saleDetailsobj.customerBillDate = this.saleDetailsobj.customerBillDate || new Date();
    this.saleDetailsobj.farmerId =  this.selectedFarmerId || 0;
    // this.saleDetailsobj.taxAmt = this.saleDetailsobj.taxAmt || 0;
    // this.saleDetailsobj.comissionAmt = this.saleDetailsobj.comissionAmt || 0;
    // this.saleDetailsobj.amt = this.saleDetailsobj.amt || 0;
    
    this.customerbillService.InsertCustomerDetails(this.saleDetailsobj).subscribe({
      next: (data: any) => {
        this.snackBar.open('Customer Bill Details saved successfully', 'Close', {
          duration: 3000,
        });
        this.GetCustomerBillDetails();
        this.clearFooterForm();
      },
      error: (err: any) => {
        console.error('Insert Customer Bill Details failed:', err);
        this.snackBar.open('Error saving Customer Bill Details', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  printCustomerBill() {
    const rows = (this.dataSource && Array.isArray(this.dataSource.data)) ? this.dataSource.data : this.saleDetails || [];
    const totalQty = this.getTotalQty();
    const totalWeight = this.getTotalWeight();
    const totalAmt = this.getTotalCost();
    const totalComAmt = rows.reduce((sum, r) => sum + Number(r.comissionAmt || 0), 0);
    const totalTaxAmt = rows.reduce((sum, r) => sum + Number(r.taxAmt || 0), 0);
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const customerName = rows.length > 0 ? rows[0].customerName : 'N/A';

    const styles = `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          padding: 20px; 
          background: #fff;
          color: #333;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .bill-container {
          max-width: 900px;
          margin: 0 auto;
          border: 2px solid #667eea;
          border-radius: 12px;
          overflow: hidden;
        }
        .bill-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 24px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .company-info h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .company-info p {
          opacity: 0.9;
          font-size: 0.9rem;
        }
        .bill-title {
          text-align: right;
        }
        .bill-title h2 {
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .bill-title .bill-date {
          margin-top: 8px;
          background: rgba(255,255,255,0.2);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
        }
        .bill-info-bar {
          background: #f8f9fc;
          padding: 16px 30px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-item label {
          font-size: 0.75rem;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .info-item span {
          font-weight: 600;
          color: #2d3748;
          font-size: 1rem;
        }
        .table-section {
          padding: 20px 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        thead th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 10px;
          text-align: left;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        thead th:first-child { border-radius: 8px 0 0 0; }
        thead th:last-child { border-radius: 0 8px 0 0; }
        tbody td {
          padding: 12px 10px;
          border-bottom: 1px solid #e2e8f0;
          color: #4a5568;
        }
        tbody tr:nth-child(even) {
          background: #f8f9fc;
        }
        tbody tr:hover {
          background: #f0f1ff;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .sr-cell {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.8rem;
        }
        tfoot td {
          padding: 14px 10px;
          font-weight: 700;
          background: #f8f9fc;
          border-top: 2px solid #667eea;
        }
        tfoot .total-label {
          color: #667eea;
          font-size: 1rem;
        }
        tfoot .total-value {
          color: #667eea;
          font-size: 1.1rem;
        }
        .summary-section {
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-top: 1px solid #e2e8f0;
        }
        .summary-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 30px;
          border-radius: 12px;
          text-align: right;
        }
        .summary-box label {
          font-size: 0.85rem;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .summary-box .amount {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 6px;
        }
        .deductions {
          background: #f8f9fc;
          padding: 16px 20px;
          border-radius: 10px;
        }
        .deductions h4 {
          font-size: 0.85rem;
          color: #667eea;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .deduction-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px dashed #e2e8f0;
        }
        .deduction-row:last-child {
          border-bottom: none;
        }
        .deduction-row span {
          color: #4a5568;
          font-size: 0.9rem;
        }
        .deduction-row strong {
          color: #2d3748;
        }
        .footer-section {
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #e2e8f0;
        }
        .signature-box {
          text-align: center;
          min-width: 180px;
        }
        .signature-box .line {
          border-top: 2px solid #4a5568;
          margin-bottom: 8px;
          margin-top: 50px;
        }
        .signature-box p {
          font-size: 0.85rem;
          color: #718096;
        }
        @media print {
          body { padding: 0; }
          .bill-container { border: 1px solid #667eea; }
        }
      </style>`;

    const rowsHtml = rows.map((r, index) => `
      <tr>
        <td><span class="sr-cell">${index + 1}</span></td>
        <td>${r.customerName || ''}</td>
        <td>${r.particularName || ''}</td>
        <td>${r.customerBillDate ? new Date(r.customerBillDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</td>
        <td class="text-right">${Number(r.qty || 0)}</td>
        <td class="text-center">${r.unit || ''}</td>
        <td class="text-right">${Number(r.weight || 0).toFixed(2)}</td>
        <td class="text-right">${Number(r.rate || 0).toFixed(2)}</td>
        <td class="text-right">${(Number(r.comissionPercent || 0) * 100).toFixed(1)}%</td>
        <td class="text-right">${Number(r.comissionAmt || 0).toFixed(2)}</td>
        <td class="text-right">${Number(r.taxAmt || 0).toFixed(2)}</td>
        <td class="text-right" style="font-weight:600;color:#667eea">${Number(r.amt || 0).toFixed(2)}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Customer Bill - ${customerName}</title>
      ${styles}
    </head>
    <body>
      <div class="bill-container">
        <div class="bill-header">
          <div class="company-info">
            <h1>Adath Plus</h1>
            <p>Agricultural Trading & Commission</p>
          </div>
          <div class="bill-title">
            <h2>Customer Bill</h2>
            <div class="bill-date">${currentDate}</div>
          </div>
        </div>

        <div class="bill-info-bar">
          <div class="info-item">
            <label>Customer</label>
            <span>${customerName}</span>
          </div>
          <div class="info-item">
            <label>Total Items</label>
            <span>${rows.length}</span>
          </div>
          <div class="info-item">
            <label>Total Weight</label>
            <span>${totalWeight.toFixed(2)} Kg</span>
          </div>
          <div class="info-item">
            <label>Bill Status</label>
            <span style="color: #10b981;">Generated</span>
          </div>
        </div>

        <div class="table-section">
          <table>
            <thead>
              <tr>
                <th>Sr</th>
                <th>Customer</th>
                <th>Particular</th>
                <th>Date</th>
                <th class="text-right">Qty</th>
                <th class="text-center">Unit</th>
                <th class="text-right">Weight</th>
                <th class="text-right">Rate</th>
                <th class="text-right">Com %</th>
                <th class="text-right">Com Amt</th>
                <th class="text-right">Tax</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="total-label">TOTALS</td>
                <td class="text-right total-value">${totalQty}</td>
                <td></td>
                <td class="text-right total-value">${totalWeight.toFixed(2)}</td>
                <td colspan="2"></td>
                <td class="text-right total-value">${totalComAmt.toFixed(2)}</td>
                <td class="text-right total-value">${totalTaxAmt.toFixed(2)}</td>
                <td class="text-right total-value">${totalAmt.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="summary-section">
          <div class="deductions">
            <h4>Summary</h4>
            <div class="deduction-row">
              <span>Gross Amount</span>
              <strong>₹ ${totalAmt.toFixed(2)}</strong>
            </div>
            <div class="deduction-row">
              <span>Commission Amount</span>
              <strong>₹ ${totalComAmt.toFixed(2)}</strong>
            </div>
            <div class="deduction-row">
              <span>Tax / Market Fee</span>
              <strong>₹ ${totalTaxAmt.toFixed(2)}</strong>
            </div>
          </div>
          <div class="summary-box">
            <label>Net Payable</label>
            <div class="amount">₹ ${totalAmt.toFixed(2)}</div>
          </div>
        </div>

        <div class="footer-section">
          <div class="signature-box">
            <div class="line"></div>
            <p>Customer Signature</p>
          </div>
          <div class="signature-box">
            <div class="line"></div>
            <p>Authorized Signature</p>
          </div>
        </div>
      </div>
      <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); }</script>
    </body>
    </html>`;

    const w = window.open('', '_blank', 'noopener');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } else {
      // fallback: create hidden iframe, write content and print
      try {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
        const idoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
        if (idoc) {
          idoc.open();
          idoc.write(html);
          idoc.close();
        }
        setTimeout(() => {
          try {
            const win = iframe.contentWindow as Window | null;
            if (win) {
              win.focus();
              win.print();
            }
          } catch (e) {
            console.error('Print fallback failed', e);
          } finally {
            setTimeout(() => { try { document.body.removeChild(iframe); } catch(_) {} }, 500);
          }
        }, 300);
      } catch (ex) {
        console.error('Unable to open print window and fallback failed', ex);
      }
    }
  }

  clearFooterForm() { 
    this.saleDetailsobj = {} as SaleDetails;
    this.selectedCustomerId = null;
    this.customerListddl.setValue('');
    this.saleDetailsobj.amt = 0;
    this.saleDetailsobj.comissionAmt = 0;
    this.saleDetailsobj.taxAmt = 0;
    this.saleDetailsobj.qty = 0;
    this.saleDetailsobj.rate = 0;
    this.saleDetailsobj.weight = 0;
    this.saleDetailsobj.unit = '';
    this.saleDetailsobj.taxAmt = 0;
    this.saleDetailsobj.comissionPercent = 0;
    this.saleDetailsobj.taxRate = 0;

  }


}
