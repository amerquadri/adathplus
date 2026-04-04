import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MasterPageComponent } from '../master-page.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, MasterPageComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  reportUrl: string = '/ReportServer/Pages/ReportViewer.aspx?%2fAdath.Reporting2022%2fReport1&rs:Command=Render';
  iframeSrc: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.showReport();
  }

  showReport(): void {
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportUrl);
  }

  exportPdf(): void {
    // Access the SSRS ReportViewer iframe (same-origin via proxy) and click its built-in PDF export
    const iframe = document.querySelector('.report-iframe') as HTMLIFrameElement;
    if (!iframe?.contentWindow) {
      alert('Report not loaded yet.');
      return;
    }

    try {
      const iframeDoc = iframe.contentWindow.document;
      // Find the PDF link in the SSRS export dropdown
      const links = iframeDoc.querySelectorAll('a');
      for (const link of Array.from(links)) {
        if (link.textContent?.trim() === 'PDF') {
          link.click();
          return;
        }
      }
      alert('PDF export option not found in the report viewer.');
    } catch (e) {
      alert('Cannot access the report viewer. Please use the export dropdown inside the report.');
    }
  }

  openInNewTab(): void {
    window.open(this.reportUrl, '_blank');
  }
}
