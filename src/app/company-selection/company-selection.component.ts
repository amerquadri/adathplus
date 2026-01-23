import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from "@angular/material/card";
import { LoginPageComponent } from '../login-page/login-page.component';
import { CompanyService } from './company.service';
import { CompanyInterface } from '../common-fields/company-interface';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-selection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './company-selection.component.html',
  styleUrls: ['./company-selection.component.css']
})
export class CompanySelectionComponent {

  companylist: CompanyInterface[] = [];
  selectedCompany: CompanyInterface | null = null;
  loginPageComponent = LoginPageComponent;
  headerComponent = HeaderComponent;
  companyId: number | null = null;
  companyName: string | null = null;


  constructor(public companyService: CompanyService,private router: Router) {
    this.getCompanyList();
  }

  getCompanyList() {
    this.companyService.getCompanyList().subscribe({
      next: (data: CompanyInterface[]) => {
        this.companylist = data;
        console.log('Company List:', this.companylist);
      },
      error: (error) => {
        console.error('Error fetching company list:', error);
      }
    });
  }
  onCompanySelected(company: any) {
    const selectedCompanyId: number = company.companyID;
    this.companyId = selectedCompanyId;
    this.companyName = company.companyName;
    console.log('Selected Company ID:', this.companyId);
  }

  confirmSelection() {
    if (this.companyId !== null) {

      this.companyService.saveDefaultCompany(this.companyId).subscribe({
        next: () => {
          console.log('Default company saved successfully');
          //this.companyService.companyId = this.selectedCompany.companyId;
          sessionStorage.setItem('companyId', this.companyId?.toString() || '');
          sessionStorage.setItem('companyName', this.companyName || '');
          this.router.navigate(['/dashboard-page']);
        },
        error: (error) => {
          console.error('Error saving default company:', error);
        }
      });
    }
  }

  loginPage() {
    this.router.navigate(['/login-page']);
  }


}
