import { Component } from '@angular/core';
import { LoginPageComponent } from '../login-page/login-page.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports : [DatePipe],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  userInfo: any = {};

  constructor() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.userInfo.userFullName = sessionStorage.getItem('userFullName');
    this.userInfo.companyName = sessionStorage.getItem('companyName');
    this.userInfo.loginTime = sessionStorage.getItem('loginTime');
  }
}
