import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginServiceService } from '../login-page/login-service.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatCardModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  userInfo: any = {};

  constructor(private router: Router, private loginService: LoginServiceService) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.userInfo = {
      authToken: this.loginService.getToken(),
      username: this.loginService.getUsername(),
      loginTime: this.loginService.getLoginTime()?.toLocaleString(),
      userId: this.loginService.getUserId(),
      userFullName: this.loginService.getUserFullName(),
      companyId: this.loginService.getCompanyId(),
      roleId: this.loginService.getRoleId()
    };
  }

  goToCustomer() {
    this.router.navigate(['/customer-page']);
  }
  goToVendor() {
    this.router.navigate(['/vendor-page']);
  }
  goToItem() {
    this.router.navigate(['/item-master-page']);
  }
}
