import { Component } from '@angular/core';
import { MasterPageComponent } from './master-page.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

interface ErrorInfo {
  message?: string;
  stack?: string;
  url?: string;
  time?: string;
  details?: any;
}

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [MasterPageComponent, CommonModule, MatButtonModule],
  template: `<app-master-page>
    <div class="error-container">
      <h2>An error occurred</h2>
      <div *ngIf="errorInfo; else simple">
        <p><strong>Message:</strong> {{ errorInfo.message }}</p>
        <p *ngIf="errorInfo.url"><strong>URL:</strong> {{ errorInfo.url }}</p>
        <p *ngIf="errorInfo.time"><strong>Time:</strong> {{ errorInfo.time }}</p>
        <pre class="stack" *ngIf="errorInfo.stack">{{ errorInfo.stack }}</pre>
        <div *ngIf="errorInfo.details">
          <h4>Additional Details</h4>
          <pre class="details">{{ errorInfo.details | json }}</pre>
        </div>
        <div class="actions">
          <button mat-stroked-button color="primary" (click)="copyError()">Copy Error</button>
        </div>
      </div>
      <ng-template #simple>
        <p>Something went wrong. Please try again later.</p>
      </ng-template>
    </div>
</app-master-page>
  `,
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {
  errorInfo: ErrorInfo | null = null;

  constructor(private router: Router) {
    // Try to obtain error from navigation state
    const nav = this.router.getCurrentNavigation?.();
    const fromNav = nav?.extras?.state?.['error'];

    // Also check history.state (in case of direct navigation)
    const hist = (window && (window as any).history && (window as any).history.state) || {};
    const fromHist = hist && hist['error'];

    // Also check sessionStorage for last saved error (some global ErrorHandler may save it)
    let fromStorage: any = null;
    try { fromStorage = sessionStorage.getItem('lastError'); fromStorage = fromStorage ? JSON.parse(fromStorage) : null; } catch { fromStorage = null; }

    const raw = fromNav || fromHist || fromStorage || null;

    if (raw) {
      this.errorInfo = this.normalizeError(raw);
    }
  }

  normalizeError(raw: any): ErrorInfo {
    const info: ErrorInfo = {};
    if (typeof raw === 'string') {
      info.message = raw;
      info.time = new Date().toISOString();
    } else if (raw instanceof Error) {
      info.message = raw.message;
      info.stack = raw.stack;
      info.time = new Date().toISOString();
    } else if (raw && typeof raw === 'object') {
      info.message = raw.message || raw.error || raw.msg || JSON.stringify(raw).slice(0,200);
      info.stack = raw.stack || raw.error?.stack || undefined;
      info.url = raw.url || (raw.request && raw.request.url) || undefined;
      info.time = raw.time || new Date().toISOString();
      info.details = raw;
    }
    return info;
  }

  copyError() {
    if (!this.errorInfo) return;
    const text = JSON.stringify(this.errorInfo, null, 2);
    navigator.clipboard?.writeText(text).then(()=>{
      console.log('Error copied');
    }).catch(()=>{
      // fallback
      const el = document.createElement('textarea'); el.value = text; document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove();
    });
  }
}
