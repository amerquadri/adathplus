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
import { MatPaginator } from '@angular/material/paginator';



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
    const ref = this.dialog.open(UserMasterDialogComponent, { width: '1000px', data: {} });
    ref.afterClosed().subscribe((result: UserMaster | undefined) => {
      if (!result) return;
      // if userId is falsy or zero, insert; otherwise update
      if (!result.userId || result.userId === 0) this.insertUser(result);
      else this.updateUser(result);
    });
  }

  openEdit(user: UserMaster) {
    const ref = this.dialog.open(UserMasterDialogComponent, { width: '1000px', data: user });
    ref.afterClosed().subscribe((result: UserMaster | undefined) => {
      if (!result) return;
      if (!result.userId || result.userId === 0) this.insertUser(result);
      else this.updateUser(result);
    });
  }





}
