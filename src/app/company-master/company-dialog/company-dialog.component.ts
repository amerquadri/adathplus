import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyInterface } from '../../common-fields/company-interface';


@Component({
  selector: 'app-company-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.css']
})
export class CompanyDialogComponent {
  public company: Partial<CompanyInterface> = {};

  constructor(
    public dialogRef: MatDialogRef<CompanyDialogComponent, CompanyInterface>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<CompanyInterface> | null
  ) {
    if (data) this.company = { ...data };
    // initialize dates if not present
    if (!this.company.createdDate) this.company.createdDate = new Date();
    if (!this.company.modifiedDate) this.company.modifiedDate = new Date();
  }

  save() {
    // basic validation could be added here
    if(this.company.companyID === undefined || this.company.companyID === null) {
      this.company.companyID = 0; // or some default/new ID logic
    }
    this.dialogRef.close(this.company as CompanyInterface);
  }

  cancel() {
    this.dialogRef.close();
  }

}
