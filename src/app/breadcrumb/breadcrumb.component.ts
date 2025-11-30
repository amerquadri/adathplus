import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter, map, startWith } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <nav class="breadcrumb-container" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a [routerLink]="['/dashboard-page']" class="breadcrumb-link">
            <mat-icon class="breadcrumb-icon">home</mat-icon>
            <span>Dashboard</span>
          </a>
        </li>
        <li *ngFor="let crumb of breadcrumbs; let last = last" 
            class="breadcrumb-item" 
            [class.active]="last">
          <mat-icon class="separator">chevron_right</mat-icon>
          <a *ngIf="!last" [routerLink]="crumb.url" class="breadcrumb-link">
            <mat-icon *ngIf="crumb.icon" class="breadcrumb-icon">{{ crumb.icon }}</mat-icon>
            <span>{{ crumb.label }}</span>
          </a>
          <span *ngIf="last" class="breadcrumb-current">
            <mat-icon *ngIf="crumb.icon" class="breadcrumb-icon">{{ crumb.icon }}</mat-icon>
            <span>{{ crumb.label }}</span>
          </span>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb-container {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-bottom: 1px solid #e0e0e0;
      padding: 12px 16px;
      margin-bottom: 16px;
      margin-top: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 0 0 8px 8px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0;
      list-style: none;
      flex-wrap: wrap;
      gap: 4px;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
    }

    .breadcrumb-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #1976d2;
      transition: all 0.3s ease-in-out;
      padding: 6px 10px;
      border-radius: 6px;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid transparent;
    }

    .breadcrumb-link:hover {
      color: #0d47a1;
      background: rgba(25, 118, 210, 0.1);
      border-color: rgba(25, 118, 210, 0.2);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15);
    }

    .breadcrumb-current {
      display: flex;
      align-items: center;
      color: #2e7d32;
      padding: 6px 10px;
      background: rgba(46, 125, 50, 0.1);
      border: 1px solid rgba(46, 125, 50, 0.2);
      border-radius: 6px;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(46, 125, 50, 0.1);
    }

    .breadcrumb-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 6px;
    }

    .separator {
      color: #666;
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin: 0 2px;
      opacity: 0.7;
    }

    .breadcrumb-item.active .breadcrumb-current {
      color: #2e7d32;
      background: rgba(46, 125, 50, 0.15);
      border-color: rgba(46, 125, 50, 0.3);
    }

    /* Mobile responsive design */
    @media (max-width: 768px) {
      .breadcrumb-container {
        padding: 10px 12px;
        margin-top: 8px;
        border-radius: 0 0 6px 6px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      }
      
      .breadcrumb {
        gap: 2px;
      }
      
      .breadcrumb-item {
        margin-bottom: 2px;
      }
      
      .breadcrumb-link {
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 14px;
        min-height: 40px;
        justify-content: flex-start;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(25, 118, 210, 0.1);
      }
      
      .breadcrumb-link:hover, .breadcrumb-link:active {
        background: rgba(25, 118, 210, 0.15);
        border-color: rgba(25, 118, 210, 0.3);
        transform: none;
        box-shadow: 0 2px 6px rgba(25, 118, 210, 0.2);
      }
      
      .breadcrumb-current {
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        min-height: 40px;
        background: linear-gradient(135deg, rgba(46, 125, 50, 0.15) 0%, rgba(46, 125, 50, 0.25) 100%);
        border: 2px solid rgba(46, 125, 50, 0.4);
        box-shadow: 0 3px 8px rgba(46, 125, 50, 0.2);
        color: #1b5e20;
      }
      
      .breadcrumb-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-right: 8px;
      }
      
      .separator {
        font-size: 14px;
        width: 14px;
        height: 14px;
        margin: 0 4px;
        color: #757575;
      }
      
      /* Stack vertically on very small screens */
      @media (max-width: 480px) {
        .breadcrumb {
          flex-direction: column;
          align-items: stretch;
          gap: 6px;
        }
        
        .breadcrumb-item {
          width: 100%;
        }
        
        .breadcrumb-link,
        .breadcrumb-current {
          width: 100%;
          justify-content: flex-start;
          padding: 12px 16px;
          border-radius: 8px;
        }
        
        .separator {
          display: none;
        }
        
        .breadcrumb-current {
          background: linear-gradient(135deg, rgba(46, 125, 50, 0.2) 0%, rgba(46, 125, 50, 0.35) 100%);
          border: 2px solid rgba(46, 125, 50, 0.5);
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25);
        }
      }
    }

    /* Tablet responsive design */
    @media (min-width: 769px) and (max-width: 1024px) {
      .breadcrumb-container {
        padding: 11px 14px;
      }
      
      .breadcrumb-link,
      .breadcrumb-current {
        padding: 7px 11px;
        font-size: 15px;
      }
      
      .breadcrumb-icon {
        font-size: 17px;
        width: 17px;
        height: 17px;
        margin-right: 7px;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .breadcrumb-container {
        background: #ffffff;
        border-bottom: 2px solid #000000;
      }
      
      .breadcrumb-link {
        background: #ffffff;
        border: 2px solid #0066cc;
        color: #0066cc;
      }
      
      .breadcrumb-current {
        background: #e6f3ff;
        border: 2px solid #003d7a;
        color: #003d7a;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .breadcrumb-container {
        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        border-bottom-color: #4a5568;
      }
      
      .breadcrumb-link {
        color: #63b3ed;
        background: rgba(45, 55, 72, 0.8);
        border-color: rgba(99, 179, 237, 0.2);
      }
      
      .breadcrumb-link:hover {
        color: #90cdf4;
        background: rgba(99, 179, 237, 0.1);
        border-color: rgba(99, 179, 237, 0.3);
      }
      
      .breadcrumb-current {
        color: #68d391;
        background: rgba(104, 211, 145, 0.1);
        border-color: rgba(104, 211, 145, 0.3);
      }
      
      .separator {
        color: #a0aec0;
      }
    }
  `]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.buildBreadcrumbs(this.activatedRoute.root)),
        startWith(this.buildBreadcrumbs(this.activatedRoute.root))
      )
      .subscribe((breadcrumbs) => {
        this.breadcrumbs = breadcrumbs;
      });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
        
        // Get breadcrumb from route data or fallback to config
        const routeData = child.snapshot.data['breadcrumb'];
        const breadcrumbConfig = this.getBreadcrumbConfig(routeURL);
        
        if (routeData || breadcrumbConfig) {
          breadcrumbs.push({
            label: routeData || breadcrumbConfig?.label || routeURL,
            url: url,
            icon: breadcrumbConfig?.icon
          });
        }
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getBreadcrumbConfig(routeURL: string): { label: string; icon?: string } | null {
    const routeConfig: { [key: string]: { label: string; icon?: string } } = {
      'customer-page': { label: 'Customer', icon: 'people' },
      'vendor-page': { label: 'Vendor', icon: 'business' },
      'item-master-page': { label: 'Item Master', icon: 'inventory_2' },
      'dashboard-page': { label: 'Dashboard', icon: 'dashboard' },
      'login-page': { label: 'Login', icon: 'login' }
    };

    return routeConfig[routeURL] || null;
  }
}