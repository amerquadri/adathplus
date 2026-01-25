import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../runtime-config.service';
import { environment } from '../../environments/environment';
import { LoginServiceService } from '../login-page/login-service.service';
import { VendorPaymentInterface } from '../vendor-payment/vendor-payment-interface';

@Injectable({ providedIn: 'root' })
export class VendorService {
  private baseUrl: string = '';
  constructor(private http: HttpClient, private loginService: LoginServiceService, private runtimeConfig: RuntimeConfigService) { 
    this.baseUrl = this.runtimeConfig.get('apiUrl', environment.apiUrl);
  }

  private getListUrl(): string {
    // Try to read company id from login service (sessionStorage). Fallback to 10001 if missing.
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    return `${this.baseUrl}/Vendor/GetVendorList?CompanyId=${companyId}`;
  }

  getVendors(): Observable<VendorPaymentInterface[]> {
    const url = this.getListUrl();
    return this.http.post<VendorPaymentInterface[]>(url, {} );
  }

  getVendorById(vendorId: number): Observable<VendorPaymentInterface> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${this.baseUrl}/Vendor/GetVendorById?VendorId=${vendorId}&CompanyId=${companyId}`;
    return this.http.post<VendorPaymentInterface>(url, {});
  }

  insertVendor(vendor: VendorPaymentInterface): Observable<VendorPaymentInterface> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    vendor.companyId = companyId;
    const insertUrl = `${this.baseUrl}/Vendor/SaveVendor`;
    return this.http.put<VendorPaymentInterface>(insertUrl, vendor);
  }

  updateVendor(vendor: VendorPaymentInterface): Observable<VendorPaymentInterface> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    vendor.companyId = companyId;
    const updateUrl = `${this.baseUrl}/Vendor/SaveVendor`;
    return this.http.put<VendorPaymentInterface >(updateUrl, vendor);
  }

  deleteVendor(vendorId: number): Observable<void> {
    
    const deleteUrl = `${this.baseUrl}/Vendor/DeleteVendorById?VendorId=${vendorId}`;
    return this.http.delete<void>(deleteUrl);
  }
}

