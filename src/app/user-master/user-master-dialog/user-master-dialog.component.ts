import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserMaster } from '../user-master.interface';
import { UsermasterService } from '../usermaster.service';

@Component({
  selector: 'app-user-master-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './user-master-dialog.component.html',
  styleUrls: ['./user-master-dialog.component.css']
})
export class UserMasterDialogComponent {
  public userMaster :any;

  constructor(

    public dialogRef: MatDialogRef<UserMasterDialogComponent, UserMaster>,
    private usermasterService: UsermasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    // Support receiving either `{ userMaster: ... }` or the user object directly as `data`.
    if (data && data.userMaster) this.userMaster = data.userMaster;
    else if (data && (data.userId || data.userName)) this.userMaster = data;
    else this.userMaster = {};
  this.initializeDates();
  }

initializeDates() {
    if (this.userMaster.createdDate && typeof this.userMaster.createdDate === 'string') {
      this.userMaster.createdDate = new Date(this.userMaster.createdDate);
    }
    if (this.userMaster.updatedDate && typeof this.userMaster.updatedDate === 'string') {
      this.userMaster.updatedDate = new Date(this.userMaster.updatedDate);
    }
  }

  prepareDatesForSave() {
    const _ToSave = { ...this.userMaster };
    if (_ToSave.createdDate instanceof Date) {
      _ToSave.createdDate = _ToSave.createdDate.toISOString();
    }
    if (_ToSave.updatedDate instanceof Date) {
      _ToSave.updatedDate = _ToSave.updatedDate.toISOString();
    }
    return _ToSave;
  }



  save() {
    // Prepare a plain object for save
    const _toSave = this.prepareDatesForSave();
    _toSave.updatedDate = new Date().toISOString();
    _toSave.updatedById = Number(sessionStorage.getItem('userId')) || 0;
    _toSave.companyId = Number(sessionStorage.getItem('companyId')) || 0;
    _toSave.createdById =  Number(sessionStorage.getItem('userId')) || 0;
    _toSave.createdDate =  new Date().toISOString();
    _toSave.isActive = 1;
    _toSave.isAdmin = true;
    _toSave.status = 1;
    _toSave.roleId = 1;
    _toSave.financialYearId = 1;
     

    if (_toSave && _toSave.userId) {
      this.usermasterService.updateUser(_toSave).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err: any) => console.error('Save failed', err)
      });
    } else {
      _toSave.userId = 0;
      this.usermasterService.insertUser(_toSave).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err: any) => console.error('Insert failed', err)
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
