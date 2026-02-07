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
    this.customerbillService.DeleteCustomerBillDetails(saleDetailsId).subscribe({
      next: (data: any) => {
        this.snackBar.open('Customer Bill Detail deleted successfully -' + customername, 'Close', {
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

    const head = `
      <style>
        body{font-family: Arial, Helvetica, sans-serif; margin:20px}
        .bill-header{text-align:center;margin-bottom:12px}
        .bill-header h1{margin:0;font-size:20px}
        .bill-header p{margin:0;font-size:12px}
        table{width:100%;border-collapse:collapse;margin-top:12px}
        th,td{border:1px solid #ddd;padding:6px;font-size:12px}
        th{background:#f5f5f5}
        tfoot td{font-weight:700}
        .bill-footer{margin-top:18px;font-size:13px}
      </style>`;

    const rowsHtml = rows.map(r => `
      <tr>
        <td>${r.customerName || ''}</td>
        <td>${r.particularName || ''}</td>
        <td>${r.customerBillDate ? new Date(r.customerBillDate).toLocaleDateString('en-GB') : ''}</td>
        <td style="text-align:right">${Number(r.qty || 0)}</td>
        <td>${r.unit || ''}</td>
        <td style="text-align:right">${Number(r.weight || 0)}</td>
        <td style="text-align:right">${Number(r.rate || 0)}</td>
        <td style="text-align:right">${Number(r.comissionPercent || 0)}</td>
        <td style="text-align:right">${Number(r.comissionAmt || 0)}</td>
        <td style="text-align:right">${Number(r.taxAmt || 0)}</td>
        <td style="text-align:right">${Number(r.amt || 0)}</td>
      </tr>`).join('');

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Customer Bill</title>${head}</head><body>
      <div class="bill-header">
        <h1>Customer Bill</h1>
        <p>Company / Address (replace with real header)</p>
        <p>Date: ${new Date().toLocaleDateString('en-GB')}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Particular</th>
            <th>Bill Date</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Weight</th>
            <th>Rate</th>
            <th>Commission %</th>
            <th>Commission Amt</th>
            <th>Tax Amt</th>
            <th>Amt</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">Total</td>
            <td style="text-align:right">${totalQty}</td>
            <td></td>
            <td style="text-align:right">${totalWeight}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style="text-align:right">${totalAmt}</td>
          </tr>
        </tfoot>
      </table>
      <div class="bill-footer">
        <p>Prepared by: ____________________</p>
        <p>Signature: ______________________</p>
      </div>
    </body></html>`;

    const w = window.open('', '_blank', 'noopener');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
      setTimeout(() => { w.focus(); w.print(); }, 300);
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
