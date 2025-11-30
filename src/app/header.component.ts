import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatCardModule } from "@angular/material/card";   


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatCardModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public isSignedIn: boolean = false;
  public userName: string | null = null;
  public isScaled80: boolean = false;

  constructor(private router: Router) {
    this.loadAuthState();
    // Refresh auth state on route changes (useful after login redirects)
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.loadAuthState());
  }

  private loadAuthState() {
    // The project stores token (and possibly user info) in sessionStorage via LoginServiceService
    const token = sessionStorage.getItem('authToken');
    // login-service stores 'username' and 'userFullName'
    const user = sessionStorage.getItem('userFullName') || sessionStorage.getItem('username') || sessionStorage.getItem('userName') || sessionStorage.getItem('user');
    this.isSignedIn = !!token;
    this.userName = user ? user : null;
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
  goToHome() {
    this.router.navigate(['/dashboard-page']);
  }
  
  logout() {
    // Clear session storage token/user and update UI
    console.log('Logout clicked');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('user');
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
}
