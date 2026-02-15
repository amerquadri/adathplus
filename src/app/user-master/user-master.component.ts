import { MasterPageComponent } from '../master-page.component';
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserMaster } from './user-master.interface';
import { UsermasterService } from './usermaster.service';
import { UserMasterDialogComponent } from './user-master-dialog/user-master-dialog.component';
import { catchError, of, timeout } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-user-master',
  standalone: true,
  imports: [MasterPageComponent,

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
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatButton
  ],
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent {
  dataSource = new MatTableDataSource<UserMaster>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['userId', 'userName', 'userFullName', 'email', 'mobile', 'isAdmin', 'status', 'companyName','isActive',  'actions'];
  searchValue: string = '';
 

  selectedUser: UserMaster | null = null;

  constructor(private userService: UsermasterService, private dialog: MatDialog) {
    this.fetchUsers();
  }

  applyFilter() {
    this.fetchUsers();
    this.dataSource.filter = this.searchValue.trim().toLowerCase();
  }

  fetchUsers() {
    this.userService.GetUserList()
      .pipe(
        timeout(15000),
        catchError(err => {
          console.error('Fetch users failed or timed out:', err);
          return of({ data: [] });
        })
      )
      .subscribe((data: any) => {
        this.dataSource.data = data.data || data || [];
        if (this.paginator) this.dataSource.paginator = this.paginator;
       // console.log('Fetched users..........:', this.dataSource.data);
      });
  }

  getUserById(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (u) => {
        this.fetchUsers();
      },
      error: (err) => console.error('getUserById error', err)
    });
  }

  insertUser(user: UserMaster) {
    user.companyId = user.companyId ?? this.userService ? (this.userService as any).loginService?.getCompanyId?.() ?? null : null;
    this.userService.insertUser(user).subscribe({
      next: (u) => {
        this.fetchUsers();
      },
      error: (err) => console.error('insertUser error', err)
    });
  }

  updateUser(user: UserMaster) {
    this.userService.updateUser(user).subscribe({
      next: (u) => {
       this.fetchUsers();
      },
      error: (err) => console.error('updateUser error', err)
    });
  }
  
//To Do : not working delete function
  deleteUser(userId: number) {
    if (!confirm('Delete user?')) return;
    this.userService.deleteByUserId(userId).subscribe({
      next: () => { 
        this.fetchUsers();
        alert('User deleted successfully.');
      },
      error: (err) =>{  
          console.error('deleteUser error', err)
          alert('Failed to delete user. Please try again later.');
      }
    });
  }

  openNew() {
    const ref = this.dialog.open(UserMasterDialogComponent, { 
      width: '700px', 
      maxHeight: '90vh',
      panelClass: 'user-master-dialog-panel',
      data: {} 
    });
    ref.afterClosed().subscribe((result: UserMaster | undefined) => {
      if (!result) return;
      // if userId is falsy or zero, insert; otherwise update
      if (!result.userId || result.userId === 0) this.insertUser(result);
      else this.updateUser(result);
    });
  }

  openEdit(user: UserMaster) {
    const ref = this.dialog.open(UserMasterDialogComponent, { 
      width: '700px', 
      maxHeight: '90vh',
      panelClass: 'user-master-dialog-panel',
      data: user 
    });
    ref.afterClosed().subscribe((result: UserMaster | undefined) => {
      if (!result) return;
      if (!result.userId || result.userId === 0) this.insertUser(result);
      else this.updateUser(result);
    });
  }

  printReport(): void {
    const rows = this.dataSource.data || [];

    const styles = `
      <style>
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: #fff; }
        .report-container { max-width: 1100px; margin: 0 auto; }
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
        .role-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .role-admin { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .role-user { background: #e8eaf6; color: #667eea; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .status-active { background: #dcfce7; color: #166534; }
        .status-inactive { background: #fee2e2; color: #991b1b; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #e8eaf6; margin-top: 20px; }
        @media print { body { padding: 0; } .report-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; } th { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .role-badge, .status-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>`;

    const rowsHtml = rows.map((r: any, idx: number) => {
      const roleClass = r.isAdmin ? 'role-admin' : 'role-user';
      const roleText = r.isAdmin ? 'Admin' : 'User';
      const statusClass = r.status === 1 ? 'status-active' : 'status-inactive';
      const statusText = r.status === 1 ? 'Active' : 'Inactive';
      return `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${r.userName || '-'}</strong></td>
          <td>${r.userFullName || '-'}</td>
          <td>${r.email || '-'}</td>
          <td>${r.mobile || '-'}</td>
          <td><span class="role-badge ${roleClass}">${roleText}</span></td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>${r.companyName || '-'}</td>
        </tr>`;
    }).join('');

    const totalAdmins = rows.filter((r: any) => r.isAdmin).length;
    const totalActive = rows.filter((r: any) => r.status === 1).length;

    const html = `<!DOCTYPE html>
      <html><head><meta charset="utf-8"><title>User Master Report</title>${styles}</head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <h1>User Master Report</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div class="report-meta">
            <div class="report-meta-item">
              <div class="report-meta-label">Total Users</div>
              <div class="report-meta-value">${rows.length}</div>
            </div>
            <div class="report-meta-item">
              <div class="report-meta-label">Admins</div>
              <div class="report-meta-value" style="color: #667eea;">${totalAdmins}</div>
            </div>
            <div class="report-meta-item">
              <div class="report-meta-label">Active Users</div>
              <div class="report-meta-value" style="color: #10b981;">${totalActive}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Status</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
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
