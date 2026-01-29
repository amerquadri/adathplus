import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatCardModule } from "@angular/material/card";

import { LoginServiceService } from '../login-page/login-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatCardModule, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public isSignedIn: boolean = false;
  public userName: string | null = null;
  public isScaled80: boolean = false;
  public formname: string = 'header-form';
  public companyName: string | null = null;
  private isBrowser: boolean = false;
  
  constructor(private router: Router, private loginService: LoginServiceService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadAuthState();
    }
    // Refresh auth state on route changes (useful after login redirects)
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      if (this.isBrowser) this.loadAuthState();
    });

  }

  private loadAuthState() {
    // Avoid accessing browser-only APIs during server-side rendering
    if (!this.isBrowser) {
      this.isSignedIn = false;
      this.userName = null;
      this.companyName = null;
      return;
    }

    // The project stores token (and possibly user info) in sessionStorage via LoginServiceService
    const token = sessionStorage.getItem('authToken');
    // login-service stores 'username' and 'userFullName'
    const user = sessionStorage.getItem('userFullName') || sessionStorage.getItem('username') || sessionStorage.getItem('userName') || sessionStorage.getItem('user');
    this.isSignedIn = !!token;
    this.userName = user ? user : null;
    this.companyName = sessionStorage.getItem('companyName');
  }

  // Toggle global 80% scale on the application root
  toggleScale() {
    this.isScaled80 = !this.isScaled80;
    try {
      const root = document.documentElement; // apply to <html>
      if (this.isScaled80) {
        root.classList.add('app-scale-80');
      } else {
        root.classList.remove('app-scale-80');
      }
    } catch (err) {
      console.warn('Unable to toggle scale on root element', err);
    }
  }

  // Set the UI to zoomed-out (80%) explicitly
  setZoomOut() {
    this.isScaled80 = true;
    try {
      document.documentElement.classList.add('app-scale-80');
    } catch (err) {
      console.warn('Unable to set zoom out on root element', err);
    }
  }

  // Reset the UI to normal scale (100%) explicitly
  setNormal() {
    this.isScaled80 = false;
    try {
      document.documentElement.classList.remove('app-scale-80');
    } catch (err) {
      console.warn('Unable to reset scale on root element', err);
    }
  }

  goToCustomer() {
    this.router.navigate(['/customer-page']);
  }
  goToCustomertest() {
    this.router.navigate(['/customer-page-test']);
  }
  goToVendor() {
    this.router.navigate(['/vendor-page']);
  }
  goToItem() {
    this.router.navigate(['/item-master-page']);
  }
  goToVendorPayment() {
    this.router.navigate(['/vendor-payment']);
  }
  goToHome() {
    this.router.navigate(['/dashboard-page']);
  }

  goToCustomerPayment() {
    this.router.navigate(['/customer-payment']);
  }

  goToFarmerBill() {
    this.router.navigate(['/farmer-bill']);
  }

  goToListOfValues() {
    this.router.navigate(['/list-of-values']);
  }

  goToCustomerBill() {
    this.router.navigate(['/customer-bill']);
  }

   goToUserMaster() {
    this.router.navigate(['/user-master']);
  }

   goToCompanyMaster() {
    this.router.navigate(['/company-master']);
  }

  logout() {
    // Clear session storage token/user and update UI
    console.log('Logout clicked');
    if (this.isBrowser) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('loginTime');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userFullName');
      sessionStorage.removeItem('companyId');
      sessionStorage.removeItem('roleId');
      sessionStorage.removeItem('companyName');
    }
    // Optionally clear everything: sessionStorage.clear();
    this.isSignedIn = false;
    this.userName = null;
    // Navigate to login page
    this.router.navigate(['/login-page']);
  }

  // Trigger sign-in flow (navigate to login page)
  signIn() {
    this.router.navigate(['/login-page']);
  }
  selectCompany() {
    this.router.navigate(['/company-selection']);
  }
}
