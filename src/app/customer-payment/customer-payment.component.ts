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
import { CustomerPaymentInterface } from '../customer-payment/customer-payment';
import { CustomerPaymentService } from './customer-payment.service';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../customer-page/confirm-dialog.component';
import { CustomerPaymentDialogComponent } from './customer-payment-dialog/customer-payment-dialog.component';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-customer-payment',
  standalone: true,
  imports: [MasterPageComponent, ReactiveFormsModule, FormsModule, MatInputModule,
    MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatDialogModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIcon,
    MatTooltipModule, CommonModule],
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
      maxHeight: '90vh',
      panelClass: 'customer-payment-dialog-panel',
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
        const dialogRef = this.dialog.open(CustomerPaymentDialogComponent, { data: { customer: vendorToOpen }, width: '700px', maxHeight: '90vh', panelClass: 'customer-payment-dialog-panel' });
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

  printReport(): void {
    const rows = this.dataSource.data || [];
    const totalAmount = rows.reduce((sum, r) => sum + (Number(r.transactionAmount) || 0), 0);
    const totalDiscount = rows.reduce((sum, r) => sum + (Number(r.discountAmount) || 0), 0);

    const styles = `
      <style>
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: #fff; }
        .report-container { max-width: 1000px; margin: 0 auto; }
        .report-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px 32px; border-radius: 12px 12px 0 0; margin-bottom: 0; }
        .report-header h1 { margin: 0 0 8px 0; font-size: 28px; font-weight: 600; }
        .report-header p { margin: 0; opacity: 0.9; font-size: 14px; }
        .report-meta { display: flex; justify-content: space-between; background: #f8f9fc; padding: 16px 32px; border-bottom: 1px solid #e8eaf6; }
        .report-meta-item { text-align: center; }
        .report-meta-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .report-meta-value { font-size: 18px; font-weight: 600; color: #333; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 0; }
        th { background: #667eea; color: white; padding: 14px 12px; text-align: left; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 12px; border-bottom: 1px solid #e8eaf6; font-size: 14px; color: #333; }
        tr:nth-child(even) { background: #f8f9fc; }
        tr:hover { background: #f0f1f8; }
        .amount { text-align: right; font-weight: 600; color: #10b981; }
        .discount { text-align: right; color: #f59e0b; }
        .method-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: capitalize; }
        .method-cash { background: #dcfce7; color: #166534; }
        .method-cheque { background: #dbeafe; color: #1e40af; }
        .method-online { background: #f3e8ff; color: #7c3aed; }
        .method-upi { background: #fef3c7; color: #92400e; }
        tfoot td { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 700; font-size: 15px; padding: 16px 12px; }
        tfoot .amount, tfoot .discount { color: white; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #e8eaf6; margin-top: 20px; }
        @media print { body { padding: 0; } .report-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; } th, tfoot td { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>`;

    const rowsHtml = rows.map((r: any, idx: number) => {
      const methodClass = (r.paymentMethod || '').toLowerCase();
      return `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${r.customerName || '-'}</strong></td>
          <td><span class="method-badge method-${methodClass}">${r.paymentMethod || '-'}</span></td>
          <td class="amount">₹ ${Number(r.transactionAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="discount">₹ ${Number(r.discountAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td>${r.transactionDate ? new Date(r.transactionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
        </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
      <html><head><meta charset="utf-8"><title>Customer Payment Report</title>${styles}</head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <h1>Customer Payment Report</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div class="report-meta">
            <div class="report-meta-item">
              <div class="report-meta-label">Total Records</div>
              <div class="report-meta-value">${rows.length}</div>
            </div>
            <div class="report-meta-item">
              <div class="report-meta-label">Total Amount</div>
              <div class="report-meta-value" style="color: #10b981;">₹ ${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="report-meta-item">
              <div class="report-meta-label">Total Discount</div>
              <div class="report-meta-value" style="color: #f59e0b;">₹ ${totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer Name</th>
                <th>Payment Method</th>
                <th style="text-align:right">Amount</th>
                <th style="text-align:right">Discount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="3"><strong>TOTAL</strong></td>
                <td class="amount">₹ ${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td class="discount">₹ ${totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          <div class="footer">This is a computer-generated report.</div>
        </div>
      </body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => { printWindow.focus(); printWindow.print(); }, 300);
    }
  }
}
enum TransactionType {
  Farmer = 1,
  Customer = 2,
}
