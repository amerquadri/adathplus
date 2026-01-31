import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';  
import { FooterComponent } from '../footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button'; 
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard-page-test',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, HeaderComponent, FooterComponent],
  templateUrl: './dashboard-page-test.component.html',
  styleUrl: './dashboard-page-test.component.css'
})
export class DashboardPageTestComponent {
 constructor(private router: Router) {}

  goToCustomer() {
    this.router.navigate(['/customer-page']);
  }
  goToCustomerMaster() {
    this.router.navigate(['/customer-master']);
  }
  goToVendor() {
    this.router.navigate(['/vendor-page']);
  }
  goToItem() {
    this.router.navigate(['/item-master-page']);
  }
}
