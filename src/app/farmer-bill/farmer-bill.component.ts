import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MasterPageComponent } from "../master-page.component";

import { VendorInterface } from './farmer-bill-interface';
import { FarmerBillService } from './farmer-bill.service';
import { FarmerBillDetailModel, farmerBill, FarmerBillExpensesModel } from './farmer-bill-interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../customer-page/confirm-dialog.component';
import { FarmerBillExpensesComponent } from './farmer-bill-expenses/farmer-bill-expenses.component';
import { ListofValuesService } from '../list-of-values/listof-values.service';
import { MarathiName } from '../common-fields/marathi-name';

@Component({
  selector: 'app-farmer-bill',
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
    MatTableModule,
    MatPaginatorModule,
    MasterPageComponent,
    
  ],
  templateUrl: './farmer-bill.component.html',
  styleUrls: ['./farmer-bill.component.css']
})
export class FarmerBillComponent implements OnInit {
  farmerBillControls: FormGroup;
  displayedColumns: string[] = ['sr',
     'particularName', 'qty', 'unit', 'rate', 'weight', 'comissionPercent', 'comissionAmount', 'amt', 'view'
  ];

  constructor(private dialog: MatDialog, private FarmerBillService: FarmerBillService, private fb: FormBuilder, private snackBar: MatSnackBar, private lovService: ListofValuesService, private marathiName: MarathiName) {
    this.farmerBillControls = this.fb.group({
      farmerBillId: [null],
      comissionBillId: [null],
      vendorId: [null],
      billDate: [null],
      companyId: [null],
      createdById: [null],
      isActive: [null],
      farmerBillDetailId: [null],
      particularName: [''],
      amt: [RequiredValidator],
      qty: [RequiredValidator],
      unit: [''],
      rate: [RequiredValidator],
      weight: [RequiredValidator],
      comissionPercent: [null],
      comissionAmount: [null]
    });
    this.loadVendorList();
    this.getVendorNameList();
    //this.GetNewComissionBillId();
    this.loadListOfValues();
  }

  public _farmerBillDetail: FarmerBillDetailModel = {} as FarmerBillDetailModel;
  public _farmerBill: farmerBill = {} as farmerBill;
  public farmerBillId: number | null = null;
  public _farmerBillExpensesModel: FarmerBillExpensesModel[] = [];
  public marathiNameObj: MarathiName = new MarathiName();

  public vendorList: VendorInterface[] = [];
  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedVendorId: any = null;
  selectedParticular: string = 'Alu';
  particularOptions: string[] = [];
  dataSource = new MatTableDataSource<FarmerBillDetailModel>([]);

  // sidebar dynamic items (label/value pairs)
  public sidebarItems: Array<{ label: string; value: number }> = [
    { label: 'कमीशन', value: 0 },
    { label: 'कमीशन', value: 0 }
  ];

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  fetchVendors(ComissionBillId: number, companyId?: number) {
    this.FarmerBillService.GetFarmerBillDetails(ComissionBillId).subscribe({
      next: (data: any) => {
        this.dataSource.data = data.data || data || [];
        if (this.paginator) this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        console.error('Fetch vendors failed:', err);
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
  confirmDelete(____farmerBillDetailId: number): void {
    this.blurActiveElement();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete item ',
        message: `Are you sure you want to delete ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteFarmerBillDetail(____farmerBillDetailId || 0);
        this.GetFarmerBill(this._farmerBill.comissionBillId || 0);
      }
    });
  }


  ngAfterViewInit() { if (this.paginator) this.dataSource.paginator = this.paginator; }

  private loadListOfValues() {
    this.lovService.getListOfValues().subscribe({
      next: (data: any[]) => {
        const items = this.mapListValues(data);

        // populate particulars for Farmer-Bill
        this.populateParticularOptions(items, 'farmer-bill-particulars');

        // populate sidebar items from same source
        this.populateSidebarFromItems(items, 'farmer-bill', 'New-Bill');
      },
      error: (err: any) => console.error('Failed to load list of values', err)
    });
  }

  /** Normalize incoming API items to a consistent shape */
  private mapListValues(data: any[] = []) {
    return (data || []).map(d => {
      const src = d || {};
      return {
        ValuesId: src.ValuesId ?? src.valuesId ?? 0,
        Form: src.Form ?? src.form ?? '',
        Name: src.Name ?? src.name ?? '',
        Values: src.Values ?? src.values ?? null,
        Details: src.Details ?? src.details ?? null
      };
    });
  }

  /** Populate `particularOptions` filtered by `formFilter` (case-insensitive) */
  private populateParticularOptions(items: Array<any>, formFilter: string) {
    this.particularOptions = (items || [])
      .filter(it => (it.Form || '').toString().toLowerCase() === (formFilter || '').toString().toLowerCase())
      .map(it => (it.Name || '').toString().trim())
      .filter((v: string, i: number, a: string[]) => v !== '' && a.indexOf(v) === i);

    if (this.particularOptions.length > 0) {
      this.selectedParticular = this.particularOptions[0];
    }
  }

  /** Populate `sidebarItems` from items filtered by `formFilter`.
   * Uses `Name` as label and numeric `Values` as value when possible.
   */
  private populateSidebarFromItems(items: Array<any>, formFilter: string, Type?: string) {

    if (Type === 'Saved-Bill') {
      this.sidebarItems = items.map(it => ({
        label: (it.name || '').toString().trim() || 'Comission',
        value: Number(it.amt) || 0
      }));
    }
    else {
      const filtered = (items || []).filter(it => (it.Form || '').toString().toLowerCase() === (formFilter || '').toString().toLowerCase());
      if (!filtered || filtered.length === 0) return;

      this.sidebarItems = filtered.map(it => ({
        label: (it.Name || '').toString().trim() || 'नया',
        value: Number(it.Values) || 0
      }));

    }
  }

  GetFarmerBill(ComissionBillId: number) {
    this.FarmerBillService.GetFarmerBill(ComissionBillId).subscribe({
      next: (response: any[]) => {
        // console.log('Farmer Bill response:', response);
        {
          // this.loadListOfValues()
          const item = Array.isArray(response) ? response[0] : response;
          if (item.farmerBillExpenses.length > 0) {
            this.populateSidebarFromItems(item.farmerBillExpenses, 'farmer-bill', 'Saved-Bill');
          } else {
            this.populateSidebarFromItems(item.farmerBillExpenses, 'farmer-bill', 'New-Bill');
          }

          const farmerBillId = item.farmerBill.farmerBillId ?? null;

          this._farmerBill.farmerBillId = farmerBillId;
          this._farmerBill.vendorId = item.farmerBill.vendorId;
          this._farmerBill.billDate = item.farmerBill.billDate;

          // set the vendor autocomplete input and selectedVendorId based on vendorId
          const foundVendor = this.vendorList.find(v => v.vendorId === this._farmerBill.vendorId);
          if (foundVendor) {
            this.selectedVendorId = foundVendor.vendorId;
            // update the autocomplete text to show the vendor name
            this.myControl.setValue((foundVendor.vendorName || '').trim());
          }
          this.fetchVendors(ComissionBillId);

          console.log("GetFarmerBill - ", item);
          console.log("farmerBillId - ", farmerBillId);
        }
      },
      error: err => console.error(err)
    });
  }

  GetNewComissionBillId() {
    this.FarmerBillService.GetNewComissionBillId().subscribe({
      next: (response: any) => {
        console.log('raw response', response);
        // normalize to a single item
        const item = Array.isArray(response) ? response[0] : response;
        this.loadListOfValues()
        this._farmerBill.farmerBillId = 0;
        this._farmerBillDetail = {} as FarmerBillDetailModel;
        const commissionId =  item?.comissionBillId ;
        this._farmerBill.comissionBillId = commissionId;
        this.dataSource.data =   [];
        this._farmerBill.vendorId = 0;
        this.myControl.setValue('');
        this.selectedParticular = 'Alu';
       // this.populateSidebarFromItems([], 'farmer-bill', 'New-Bill');
       // console.log("New ComissionBillId - ", commissionId);
      },
      error: err => console.error(err)
    });
  }


  GetFarmerBillDetails(ComissionBillId: number, companyId?: number) {
    this.FarmerBillService.GetFarmerBillDetails(ComissionBillId).subscribe({
      next: (response: any[]) => {
        console.log('Farmer Bill Details response:', response);
      },
      error: err => console.error(err)
    });
  }


  getVendorNameList() {
    this.FarmerBillService.getVendors().subscribe({
      next: (response: VendorInterface[]) => {
        this.vendorList = response || [];
        this.options = this.vendorList.map(v => (v.vendorName || '').trim());
        // update filteredOptions in case valueChanges stream hasn't emitted yet
        // this.filteredOptions = of(this.options);
        //console.log('Vendor list loaded', this.vendorList);
      },
      error: (err: any) => console.error('Failed to load vendor list', err)
    });
  }

  /** Return true when all entry inputs are filled and valid */
  public isEntryValid(): boolean {
    const d = this._farmerBillDetail || ({} as FarmerBillDetailModel);
    const hasParticular = (this.selectedParticular || '').toString().trim().length > 0;
    const _date = this._farmerBill.billDate;
    const qty = Number(d.qty);
    const rate = Number(d.rate);
    const weight = Number(d.weight);
    const unit = (d.unit || '').toString().trim().length > 0;
    const comPercent = d.comissionPercent !== null && d.comissionPercent !== undefined  ? Number(d.comissionPercent) : NaN;

    if (!hasParticular) return false;
    if (!unit) return false;
    if (!comPercent) return false; // allow 0 if explicitly provided
    if (isNaN(qty) || qty <= 0) return false;
    if (isNaN(rate) || rate <= 0) return false;
    if (isNaN(weight)) return false;
    if(!_date || !(_date instanceof Date) || isNaN(_date.getTime())) return false;
    return true;
  }

  deleteFarmerBillDetail(farmerBillDetailId: number) {
    this.FarmerBillService.delete(farmerBillDetailId).subscribe({
      next: (response: any) => {  
        console.log('Farmer Bill Detail deleted:', response);
        this.snackBar.open('Deleted Successfully!', 'Close', {
          duration: 3000, horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
      },
      error: err => {
        console.error('Error deleting farmer bill detail: ', err);
         this.snackBar.open('Error Deleting '+err, 'Close', {
          duration: 3000, horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
      }
    });
  }


  insertFarmerBillDetails() {

    const _farmerBillControls: farmerBill = this._farmerBill;
    if (!this._farmerBill) {
      this.snackBar.open('No farmer bill to insert', 'Close', { duration: 3000 });
      return;
    }

    {
      this._farmerBill.vendorId = this.selectedVendorId;
      // read BillDate from form input with id 'BillDate' (if present)
      const billDateEl = document.getElementById('billDate') as HTMLInputElement | null;
      if (billDateEl && billDateEl.value) {
        // convert input string to Date to match model type
        const parsedDate = new Date(billDateEl.value);
        this._farmerBill.billDate = isNaN(parsedDate.getTime()) ? new Date(billDateEl.value) : parsedDate;
      }

      // this._farmerBill.farmerBillId = _farmerBillControls.farmerBillId;//-----------------------
      // read existing FarmerBillId from form input with id 'FarmerBillId' (if present)
      const farmerBillIdEl = document.getElementById('farmerBillId') as HTMLInputElement | null;
      if (farmerBillIdEl && farmerBillIdEl.value) {
        // this._farmerBill.farmerBillId = Number(farmerBillIdEl.value);
      }

      // read ComissionBillId from form input with id 'ComissionBillId' (if present)
      const comissionEl = document.getElementById('comissionBillId') as HTMLInputElement | null;
      if (comissionEl && comissionEl.value) {
        const val = Number(comissionEl.value);
        //this._farmerBill.comissionBillId = comissionEl.value ? val : 0;
        // also assign to model so service receives it
        // (this._farmerBill as any).comissionBillId = this.comissionBillId;
      }
    }
    this._farmerBillDetail.ComissionBillId = this._farmerBill.comissionBillId || 0;
    this._farmerBillDetail.particularName = this.selectedParticular;
    this._farmerBillDetail.companyId = this._farmerBill.companyId;
    //this._farmerBillDetail.farmerBillDetailId = 0; // new detail
    this._farmerBillDetail.amt = this._farmerBillDetail.rate! * this._farmerBillDetail.qty!;
    this._farmerBill.isActive = true;

    console.log('Calling InsertFarmerBillDetails with', this._farmerBill, this._farmerBillDetail);
    this.FarmerBillService.InsertFarmerBillDetails(this._farmerBill, this._farmerBillDetail, this.sidebarItems).subscribe({
      next: (response: number) => {
        console.log('Farmer Bill Detail inserted:', response);
        this.snackBar.open('Saved Successfully!', 'Close', {
          duration: 3000, horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });

        this.farmerBillId = response;
        // previously: $('#FarmerBillId').val(data);
        this.loadFarmerBillDetails(this._farmerBill.comissionBillId, this._farmerBill.companyId);
        this.calculateGrandTotal();
        this.GetFarmerBill(this._farmerBillDetail.ComissionBillId);
      },
      error: (err: any) => {
        console.error('Error inserting farmer bill detail: ', err);
      }
    });
  }


  insertFarmerBill() {

    const _farmerBillControls: farmerBill = this._farmerBill;
    if (!this._farmerBill) {
      this.snackBar.open('No farmer bill to insert', 'Close', { duration: 3000 });
      return;
    }

    {
      this._farmerBill.vendorId = this.selectedVendorId;
      // read BillDate from form input with id 'BillDate' (if present)
      const billDateEl = document.getElementById('billDate') as HTMLInputElement | null;
      if (billDateEl && billDateEl.value) {
        // convert input string to Date to match model type
        const parsedDate = new Date(billDateEl.value);
        this._farmerBill.billDate = isNaN(parsedDate.getTime()) ? new Date(billDateEl.value) : parsedDate;
      }

      // this._farmerBill.farmerBillId = _farmerBillControls.farmerBillId;//-----------------------
      // read existing FarmerBillId from form input with id 'FarmerBillId' (if present)
      const farmerBillIdEl = document.getElementById('farmerBillId') as HTMLInputElement | null;
      if (farmerBillIdEl && farmerBillIdEl.value) {
        // this._farmerBill.farmerBillId = Number(farmerBillIdEl.value);
      }

      // read ComissionBillId from form input with id 'ComissionBillId' (if present)
      const comissionEl = document.getElementById('comissionBillId') as HTMLInputElement | null;
      if (comissionEl && comissionEl.value) {
        const val = Number(comissionEl.value);
        //this._farmerBill.comissionBillId = comissionEl.value ? val : 0;
        // also assign to model so service receives it
        // (this._farmerBill as any).comissionBillId = this.comissionBillId;
      }
    }
    this._farmerBillDetail.ComissionBillId = this._farmerBill.comissionBillId || 0;
    this._farmerBillDetail.particularName = this.selectedParticular;
    this._farmerBillDetail.companyId = this._farmerBill.companyId;
    //this._farmerBillDetail.farmerBillDetailId = 0; // new detail
    this._farmerBillDetail.amt = this._farmerBillDetail.rate! * this._farmerBillDetail.qty!;
    this._farmerBill.isActive = true;

    console.log('Calling InsertFarmerBillDetails with', this._farmerBill, this._farmerBillDetail);
    this.FarmerBillService.InsertFarmerBill(this._farmerBill, this._farmerBillDetail, this.sidebarItems).subscribe({
      next: (response: number) => {
        console.log('Farmer Bill Detail inserted:', response);
        this.snackBar.open('Saved Successfully!', 'Close', {
          duration: 3000, horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });

        this.farmerBillId = response;
        // previously: $('#FarmerBillId').val(data);
        this.loadFarmerBillDetails(this._farmerBill.comissionBillId, this._farmerBill.companyId);
        this.calculateGrandTotal();
        this.GetFarmerBill(this._farmerBillDetail.ComissionBillId);
      },
      error: (err: any) => {
        console.error('Error inserting farmer bill detail: ', err);
      }
    });
  }


  private loadFarmerBillDetails(comissionBillId?: number, companyId?: number) {
    // TODO: implement actual loading of farmer bill details
    console.log('loadFarmerBillDetails called', comissionBillId, companyId);
  }

  private calculateGrandTotal() {
    // compute and log grand total (sums sidebar items + detail amounts if needed)
    console.log('calculateGrandTotal called - total:', this.sidebarTotal);
  }

  // Sidebar helpers
  public addSidebarItem(): void {
    this.sidebarItems.push({ label: 'नया', value: 0 });
  }

  public removeSidebarItem(index: number): void {
    if (index >= 0 && index < this.sidebarItems.length) {
      this.sidebarItems.splice(index, 1);
    }
  }

  public get sidebarTotal(): number {
    return this.sidebarItems.reduce((sum, it) => sum + (Number(it.value) || 0), 0);
  }

  onExpensesChanged(expenses: any[]) {
    console.log('Expenses updated:', expenses);
    // persist or attach to bill payload as needed
  }

  // Open expenses component in a dialog
  public openExpensesDialog(): void {
    const ref = this.dialog.open(FarmerBillExpensesComponent, {
      width: '720px',
      maxHeight: '80vh'
    });

    // Subscribe to events emitted by the dialog component
    // (componentInstance is available for standalone components opened with MatDialog)
    const instance: any = ref.componentInstance as any;
    if (instance && instance.expensesChanged && instance.expensesChanged.subscribe) {
      const sub = instance.expensesChanged.subscribe((expenses: any[]) => {
        this.onExpensesChanged(expenses);
      });
      // also handle final result when dialog closes
      ref.afterClosed().subscribe((result: any) => {
        if (result) {
          this.onExpensesChanged(result);
        }
        sub.unsubscribe();
      });
    } else {
      // fallback: process dialog close result
      ref.afterClosed().subscribe((result: any) => {
        if (result) this.onExpensesChanged(result);
      });
    }
  }


  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.loadListOfValues();
  }

  printFarmerBill() {
    const rows = (this.dataSource && Array.isArray(this.dataSource.data)) ? this.dataSource.data : [];
    const totalQty = rows.reduce((s: number, r: any) => s + (Number(r.qty) || 0), 0);
    const totalWeight = rows.reduce((s: number, r: any) => s + (Number(r.weight) || 0), 0);
    const totalAmt = rows.reduce((s: number, r: any) => s + (Number(r.amt) || 0), 0);

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
      </style>`;

    const rowsHtml = rows.map((r: any) => `
      <tr>
        <td>${r.particularName || ''}</td>
        <td style="text-align:right">${Number(r.qty || 0)}</td>
        <td>${r.unit || ''}</td>
        <td style="text-align:right">${Number(r.weight || 0)}</td>
        <td style="text-align:right">${Number(r.rate || 0)}</td>
        <td style="text-align:right">${Number(r.comissionPercent || 0)}</td>
        <td style="text-align:right">${Number(r.comissionAmount || 0)}</td>
        <td style="text-align:right">${Number(r.amt || 0)}</td>
      </tr>`).join('');

    // include sidebar details
    const detailsHtml = (this.sidebarItems || []).map(it => `
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
        <div style="background:#fafafa;border:1px solid #eee;padding:8px 10px;border-radius:6px;min-width:120px;font-weight:600">${(it.label||'').toString()}</div>
        <div style="border:1px solid #eee;padding:8px 10px;border-radius:6px;min-width:100px;text-align:right">${Number(it.value||0)}</div>
      </div>
    `).join('');

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Farmer Bill</title>${head}</head><body>
      <div class="bill-header">
        <h1>Farmer Bill</h1>
        <p>Bill No: ${this._farmerBill.comissionBillId || ''} | Date: ${this._farmerBill.billDate ? new Date(this._farmerBill.billDate).toLocaleDateString('en-GB') : ''}</p>
      </div>
      <div style="display:flex;gap:20px;align-items:flex-start">
        <div style="flex:1;min-width:600px">
          <table>
            <thead>
              <tr>
                <th>Particular</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Weight</th>
                <th>Rate</th>
                <th>Com %</th>
                <th>Com Amt</th>
                <th>Amt</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td style="text-align:right">${totalQty}</td>
                <td></td>
                <td style="text-align:right">${totalWeight}</td>
                <td></td>
                <td></td>
                <td></td>
                <td style="text-align:right">${totalAmt}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style="width:260px">
          <div style="font-weight:700;margin-bottom:8px;padding:6px 8px;background:#f5f5f5;border:1px solid #e6e6e6;text-align:center">Details</div>
          ${detailsHtml}
        </div>
      </div>
      <div style="margin-top:18px;font-size:13px">
        <p>Prepared by: ____________________</p>
        <p>Signature: ______________________</p>
      </div>
    </body></html>`;

    const w = window.open('', '_blank', 'noopener');
    // if (w) {
    //   w.document.open();
    //   w.document.write(html);
    //   w.document.close();
    //   setTimeout(() => { w.focus(); w.print(); }, 300);
    // } else
       {
      // iframe fallback
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



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onVendorSelected(selectedName: string) {
    const target = (selectedName || '').trim();
    const found = this.vendorList.find(v => (v.vendorName || '').trim() === target);
    this.selectedVendorId = found ? found.vendorId : null;
    // you can use selectedVendorId for form submission or further logic
    // alert(`Selected Vendor ID: ${this.selectedVendorId}`);
  }

  private loadVendorList() {
    this.getVendorNameList();
  }



}
