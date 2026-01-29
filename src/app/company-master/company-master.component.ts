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
  imports: [MasterPageComponent, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatDialogModule, MatTableModule, MatPaginatorModule, MatIconModule],
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
    const ref = this.dialog.open(CompanyDialogComponent, { data: empty, width: '800px' });
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
        const ref = this.dialog.open(CompanyDialogComponent, { data: c, width: '800px' });
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
}

 
