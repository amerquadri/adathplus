import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event as RouterEvent } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-master-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, BreadcrumbComponent, MatMenuModule, MatButtonModule, MatProgressBarModule, NgIf],
  templateUrl: './master-page.component.html',
  styleUrl: './master-page.component.css'
})
export class MasterPageComponent implements OnInit, OnDestroy, AfterViewInit {
  public isLoading = false;
  private routerSub: Subscription | null = null;
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  public formname: string = 'master-page';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.headerComponent) {
      this.headerComponent.formname = this.formname;
    }
  }


  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
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
