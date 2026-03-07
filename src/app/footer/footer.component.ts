import { Component } from '@angular/core';
import { LoginPageComponent } from '../login-page/login-page.component';
import { DatePipe } from '@angular/common';
import { RuntimeConfigService } from '../runtime-config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports : [DatePipe],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  userInfo: any = {};
  currentYear: number = new Date().getFullYear();
  appVersion: string = '';

  constructor(private configService: RuntimeConfigService) {
    this.loadUserInfo();
    this.appVersion = this.configService.get('version', '1.0.0.0');
  }

  loadUserInfo() {
    this.userInfo.userFullName = sessionStorage.getItem('userFullName');
    this.userInfo.companyName = sessionStorage.getItem('companyName');
    this.userInfo.loginTime = sessionStorage.getItem('loginTime');
  }
}
