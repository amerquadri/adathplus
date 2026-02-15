import { Component, ViewChild } from '@angular/core';
import { MasterPageComponent } from '../master-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyService } from '../company-selection/company.service';
import { CompanyInterface } from '../common-fields/company-interface';
import { CompanyDialogComponent } from './company-dialog/company-dialog.component';
import { ConfirmDialogComponent } from '../customer-page/confirm-dialog.component';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginServiceService } from '../login-page/login-service.service';

@Component({
  selector: 'app-company-master',
  standalone: true,
  imports: [MasterPageComponent, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatDialogModule, MatTableModule, MatPaginatorModule, MatIconModule, MatTooltipModule],
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.css']
})
export class CompanyMasterComponent {
  public CompanyDialog = CompanyDialogComponent;
  public ConfirmDialog = ConfirmDialogComponent;

  dataSource = new MatTableDataSource<CompanyInterface>([]);
  displayedColumns: string[] = ['companyID','companyName','phone1','email1','address1','city','state','zipCode','website','financialYear','isActive','view'];
  searchValue: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private companyService: CompanyService, private dialog: MatDialog, private loginService: LoginServiceService) {
    this.fetchCompanies();
  }

  fetchCompanies() {
    this.companyService.getCompanyList()
      .pipe(
        timeout(15000),
        catchError(err => {
          console.error('Fetch companies failed or timed out:', err);
          return of([]);
        })
      ).subscribe((data: any) => {
        // API may return { data: [...] } or array directly
        const list = (data && data.data) ? data.data : data || [];
        this.dataSource.data = list as CompanyInterface[];
        if (this.paginator) this.dataSource.paginator = this.paginator;
      });
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.fetchCompanies();
    this.dataSource.filter = this.searchValue.trim().toLowerCase();
  }

  openNewCompanyDialog() {
    const empty: Partial<CompanyInterface> = { companyID: null as any, companyName: '', isActive: true };
    this.blurActiveElement();
    const ref = this.dialog.open(CompanyDialogComponent, { data: empty, width: '800px', panelClass: 'company-master-dialog-panel' });
    ref.afterClosed().subscribe((result: CompanyInterface | undefined) => {
      if (result) {
        // save via service
        this.companyService.saveCompanyChanges(result as CompanyInterface).subscribe({ next: ()=> this.fetchCompanies(), error: err=> console.error('Save failed', err) });
      }
    });
  }

  viewCompany(company: CompanyInterface) { 
    this.companyService.getCompanyById(company.companyID!).subscribe({
      next: (resp: any) => {
        const fetched = resp && resp.data ? resp.data : resp;
        const c = Array.isArray(fetched) ? fetched[0] : fetched;
        this.blurActiveElement();
        const ref = this.dialog.open(CompanyDialogComponent, { data: c, width: '800px', panelClass: 'company-master-dialog-panel' });
        ref.afterClosed().subscribe((result: CompanyInterface | undefined) => {
          if (result) {
            result.createdBy =this.loginService.getUserId() || 0;
            result.modifiedDateBy =this.loginService.getUserId() || 0;
            result.modifiedDate = new Date();
            result.createdDate = new Date();
            result.isActive = true;
            result.financialYear ="";
            if(result.companyID !== undefined && result.companyID !== null && result.companyID <=0){
              result.companyID = 0;
            } 
          this.companyService.saveCompanyChanges(result as CompanyInterface).subscribe({ next: ()=> this.fetchCompanies(), error: err=> console.error('Save failed', err) });
          }
        });
      }, error: err => console.error('Fetch company failed', err)
    });
  }

  confirmDeleteCompany(company: CompanyInterface) {
    this.blurActiveElement();
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Delete Company', message: `Are you sure you want to delete company '${company.companyName}'?` }
    });
    ref.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        // soft-delete by marking inactive if backend lacks delete endpoint
        const copy = { ...company, isActive: false } as CompanyInterface;
        this.companyService.saveCompanyChanges(copy).subscribe({ next: ()=> this.fetchCompanies(), error: err=> console.error('Delete failed', err) });
      }
    });
  }

  private blurActiveElement(): void {
    try {
      const ae = (typeof document !== 'undefined') ? (document.activeElement as HTMLElement | null) : null;
      if (ae && typeof ae.blur === 'function') ae.blur();
    } catch (e) { }
  }

  printReport(): void {
    const companies = this.dataSource.filteredData;
    const activeCount = companies.filter(c => c.isActive).length;
    const inactiveCount = companies.length - activeCount;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Company Master Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; padding: 20px; }
          .report-container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
          .report-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 32px; text-align: center; }
          .report-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
          .report-header p { opacity: 0.9; font-size: 14px; }
          .report-meta { display: flex; justify-content: space-around; padding: 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 12px; }
          .meta-item { text-align: center; }
          .meta-value { font-size: 24px; font-weight: 700; color: #667eea; }
          .meta-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
          .report-content { padding: 24px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 12px; text-align: left; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px; }
          td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #334155; }
          tr:nth-child(even) { background: #f8fafc; }
          tr:hover { background: #f1f5f9; }
          .id-cell { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 700; text-align: center; border-radius: 6px; padding: 4px 8px; display: inline-block; min-width: 32px; }
          .company-name { font-weight: 600; color: #1e293b; }
          .company-detail { font-size: 11px; color: #64748b; }
          .status-active { background: #d1fae5; color: #047857; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 11px; }
          .status-inactive { background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 11px; }
          .location-badge { background: #f0fdf4; color: #16a34a; padding: 2px 8px; border-radius: 12px; font-size: 11px; }
          .report-footer { padding: 20px; text-align: center; background: #f8fafc; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
          @media print { 
            body { padding: 0; background: white; } 
            .report-container { box-shadow: none; } 
            @page { margin: 10mm; }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <h1>Company Master Report</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div class="report-meta">
            <div class="meta-item">
              <div class="meta-value">${companies.length}</div>
              <div class="meta-label">Total Companies</div>
            </div>
            <div class="meta-item">
              <div class="meta-value" style="color: #047857;">${activeCount}</div>
              <div class="meta-label">Active</div>
            </div>
            <div class="meta-item">
              <div class="meta-value" style="color: #dc2626;">${inactiveCount}</div>
              <div class="meta-label">Inactive</div>
            </div>
          </div>
          <div class="report-content">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Website</th>
                  <th>FY</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${companies.map(c => `
                  <tr>
                    <td><span class="id-cell">${c.companyID || '-'}</span></td>
                    <td>
                      <div class="company-name">${c.companyName || '-'}</div>
                      <div class="company-detail">${c.detail || ''}</div>
                    </td>
                    <td>${c.phone1 || '-'}</td>
                    <td>${c.email1 || '-'}</td>
                    <td><span class="location-badge">${c.city || '-'}</span></td>
                    <td>${c.state || '-'}</td>
                    <td>${c.website || '-'}</td>
                    <td>${c.financialYear || '-'}</td>
                    <td><span class="${c.isActive ? 'status-active' : 'status-inactive'}">${c.isActive ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="report-footer">
            <p>© ${new Date().getFullYear()} Company Management System • This is a computer generated report</p>
          </div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  }
}
