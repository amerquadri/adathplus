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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import {  startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { catchError, map, Observable, of, timeout } from 'rxjs';
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
    MatTooltipModule,
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
     'particularName', 'qty', 'unit', 'rate', 'weight', 'comissionPercent',  'amt', 'view'
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


  

  getTotalCost(): number {
    const arr = Array.isArray(this.dataSource?.data)
      ? this.dataSource.data : (Array.isArray(this._farmerBillDetail) ? this._farmerBillDetail : [] as any[]);
    if (!arr || arr.length === 0) return 0;

    return arr.reduce((acc, t: any) => acc + (Number(t?.amt) || 0), 0);
  }

  getTotalQty() {
   const arr = Array.isArray(this.dataSource?.data)
      ? this.dataSource.data : (Array.isArray(this._farmerBillDetail) ? this._farmerBillDetail : [] as any[]);
    if (!arr || arr.length === 0) return 0;

    return arr.reduce((acc, t: any) => acc + (Number(t?.qty) || 0), 0);
  }

  getTotalWeight() {    
    const arr = Array.isArray(this.dataSource?.data)
      ? this.dataSource.data : (Array.isArray(this._farmerBillDetail) ? this._farmerBillDetail : [] as any[]);
    if (!arr || arr.length === 0) return 0;

    return arr.reduce((acc, t: any) => acc + (Number(t?.weight) || 0), 0);
  }


  getTotalComAmt() {    
    const arr = Array.isArray(this.dataSource?.data)
      ? this.dataSource.data : (Array.isArray(this._farmerBillDetail) ? this._farmerBillDetail : [] as any[]);
    if (!arr || arr.length === 0) return 0;

    return arr.reduce((acc, t: any) => acc + (Number(t?.comissionAmount) || 0), 0);
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
    const totalComAmt = rows.reduce((s: number, r: any) => s + (Number(r.comissionAmount) || 0), 0);
    
    // Calculate net amount (total - deductions)
    const deductionsTotal = this.sidebarTotal || 0;
    const netAmount = totalAmt - deductionsTotal;

    // Get current date and time
    const now = new Date();
    const printDateTime = now.toLocaleString('en-IN', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true 
    });

    // Get selected farmer name
    const farmerName = this.myControl.value || 'N/A';

    const head = `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          padding: 20px;
          background: #fff;
          color: #333;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .bill-container {
          max-width: 800px;
          margin: 0 auto;
          border: 2px solid #333;
          padding: 0;
        }
        
        /* Header */
        .bill-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 20px;
          text-align: center;
        }
        .bill-header h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
          letter-spacing: 1px;
        }
        .bill-header .subtitle {
          font-size: 12px;
          opacity: 0.9;
        }
        
        /* Bill Info */
        .bill-info {
          display: flex;
          justify-content: space-between;
          padding: 12px 20px;
          background: #f8f9fc;
          border-bottom: 1px solid #ddd;
        }
        .bill-info-left, .bill-info-right {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .bill-info-right {
          text-align: right;
        }
        .info-row {
          display: flex;
          gap: 8px;
        }
        .info-label {
          font-weight: 600;
          color: #666;
        }
        .info-value {
          font-weight: 600;
          color: #333;
        }
        
        /* Main Content */
        .bill-content {
          display: flex;
          gap: 0;
        }
        
        /* Table Section */
        .table-section {
          flex: 1;
          padding: 0;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th {
          background: #667eea;
          color: white;
          padding: 10px 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid #5a6fd6;
        }
        
        td {
          padding: 8px;
          border: 1px solid #ddd;
          font-size: 12px;
        }
        
        tr:nth-child(even) {
          background: #f9f9f9;
        }
        
        tr:hover {
          background: #f0f0f0;
        }
        
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        tfoot td {
          background: #f5f5f5;
          font-weight: 700;
          border-top: 2px solid #667eea;
        }
        
        tfoot .total-label {
          background: #667eea;
          color: white;
          font-weight: 700;
        }
        
        tfoot .total-amount {
          background: #4caf50;
          color: white;
          font-weight: 700;
          font-size: 14px;
        }
        
        /* Details Section */
        .details-section {
          width: 220px;
          border-left: 2px solid #667eea;
          background: #fafafa;
        }
        
        .details-header {
          background: #667eea;
          color: white;
          padding: 10px 12px;
          font-weight: 700;
          text-align: center;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .details-list {
          padding: 10px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          margin-bottom: 6px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
        }
        
        .detail-label {
          font-weight: 500;
          color: #555;
          font-size: 11px;
        }
        
        .detail-value {
          font-weight: 700;
          color: #f44336;
          font-size: 12px;
        }
        
        .details-total {
          margin-top: 10px;
          padding: 10px;
          background: #fff3e0;
          border: 1px solid #ffcc80;
          border-radius: 4px;
        }
        
        .details-total .detail-label {
          color: #e65100;
          font-weight: 700;
        }
        
        .details-total .detail-value {
          color: #e65100;
          font-size: 14px;
        }
        
        /* Summary Section */
        .bill-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .summary-left {
          font-size: 14px;
        }
        
        .net-total {
          text-align: right;
        }
        
        .net-total-label {
          font-size: 12px;
          opacity: 0.9;
          margin-bottom: 4px;
        }
        
        .net-total-amount {
          font-size: 28px;
          font-weight: 700;
        }
        
        /* Footer */
        .bill-footer {
          display: flex;
          justify-content: space-between;
          padding: 20px;
          border-top: 1px dashed #ccc;
          background: #fff;
        }
        
        .signature-box {
          width: 200px;
        }
        
        .signature-line {
          border-bottom: 1px solid #333;
          margin-bottom: 6px;
          height: 30px;
        }
        
        .signature-label {
          font-size: 11px;
          color: #666;
          text-align: center;
        }
        
        .print-info {
          font-size: 10px;
          color: #999;
          text-align: center;
          padding: 8px;
          border-top: 1px solid #eee;
        }
        
        /* Print Styles */
        @media print {
          body { padding: 0; }
          .bill-container { border: 1px solid #333; }
          .bill-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .details-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bill-summary { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          tfoot .total-label, tfoot .total-amount { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>`;

    const rowsHtml = rows.map((r: any, idx: number) => `
      <tr>
        <td class="text-center">${idx + 1}</td>
        <td>${r.particularName || '-'}</td>
        <td class="text-right">${Number(r.qty || 0)}</td>
        <td class="text-center">${r.unit || '-'}</td>
        <td class="text-right">${Number(r.weight || 0)}</td>
        <td class="text-right">₹${Number(r.rate || 0).toLocaleString('en-IN')}</td>
        <td class="text-center">${Number(r.comissionPercent || 0)}%</td>
        <td class="text-right">₹${Number(r.comissionAmount || 0).toLocaleString('en-IN')}</td>
        <td class="text-right">₹${Number(r.amt || 0).toLocaleString('en-IN')}</td>
      </tr>`).join('');

    // Deductions/Details section
    const detailsHtml = (this.sidebarItems || []).filter(it => it.label || it.value).map(it => `
      <div class="detail-item">
        <span class="detail-label">${(it.label || '').toString()}</span>
        <span class="detail-value">₹${Number(it.value || 0).toLocaleString('en-IN')}</span>
      </div>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Farmer Bill - ${this._farmerBill.comissionBillId || 'New'}</title>
  ${head}
</head>
<body>
  <div class="bill-container">
    <!-- Header -->
    <div class="bill-header">
      <h1>🌾 FARMER BILL</h1>
      <div class="subtitle">शेतकरी बिल / Purchase Invoice</div>
    </div>
    
    <!-- Bill Info -->
    <div class="bill-info">
      <div class="bill-info-left">
        <div class="info-row">
          <span class="info-label">Bill No:</span>
          <span class="info-value">#${this._farmerBill.comissionBillId || 'NEW'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Farmer:</span>
          <span class="info-value">${farmerName}</span>
        </div>
      </div>
      <div class="bill-info-right">
        <div class="info-row">
          <span class="info-label">Date:</span>
          <span class="info-value">${this._farmerBill.billDate ? new Date(this._farmerBill.billDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Printed:</span>
          <span class="info-value">${printDateTime}</span>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="bill-content">
      <!-- Table -->
      <div class="table-section">
        <table>
          <thead>
            <tr>
              <th style="width:40px">Sr</th>
              <th>Particular</th>
              <th style="width:50px">Qty</th>
              <th style="width:50px">Unit</th>
              <th style="width:60px">Weight</th>
              <th style="width:70px">Rate</th>
              <th style="width:50px">Com%</th>
              <th style="width:70px">Com Amt</th>
              <th style="width:80px">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="9" class="text-center" style="padding:20px;color:#999;">No items added</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td class="total-label" colspan="2">TOTAL</td>
              <td class="text-right" style="font-weight:700">${totalQty}</td>
              <td></td>
              <td class="text-right" style="font-weight:700">${totalWeight}</td>
              <td></td>
              <td></td>
              <td class="text-right" style="font-weight:700">₹${totalComAmt.toLocaleString('en-IN')}</td>
              <td class="total-amount text-right">₹${totalAmt.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- Details/Deductions -->
      <div class="details-section">
        <div class="details-header">📋 Deductions</div>
        <div class="details-list">
          ${detailsHtml || '<div class="detail-item"><span class="detail-label">No deductions</span><span class="detail-value">₹0</span></div>'}
          
          <div class="details-total">
            <div class="detail-item" style="border:none;margin:0;padding:0;background:transparent;">
              <span class="detail-label">Total Deductions</span>
              <span class="detail-value">₹${deductionsTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Summary -->
    <div class="bill-summary">
      <div class="summary-left">
        <div>Items: ${rows.length} | Total Weight: ${totalWeight} | Total Qty: ${totalQty}</div>
      </div>
      <div class="net-total">
        <div class="net-total-label">NET PAYABLE AMOUNT</div>
        <div class="net-total-amount">₹${netAmount.toLocaleString('en-IN')}</div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="bill-footer">
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-label">Farmer's Signature</div>
      </div>
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-label">Authorized Signature</div>
      </div>
    </div>
    
    <!-- Print Info -->
    <div class="print-info">
      This is a computer generated bill. | Printed on: ${printDateTime}
    </div>
  </div>
  
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

    const w = window.open('', '_blank', 'noopener');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } else {
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
