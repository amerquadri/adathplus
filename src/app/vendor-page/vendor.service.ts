import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginServiceService } from '../login-page/login-service.service';
import { VendorPaymentInterface } from '../vendor-payment/vendor-payment-interface';

const localurl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class VendorService {
  constructor(private http: HttpClient, private loginService: LoginServiceService) {}

  private getListUrl(): string {
    // Try to read company id from login service (sessionStorage). Fallback to 10001 if missing.
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    return `${localurl}/Vendor/GetVendorList?CompanyId=${companyId}`;
  }

  getVendors(): Observable<VendorPaymentInterface[]> {
    const url = this.getListUrl();
    return this.http.post<VendorPaymentInterface[]>(url, {} );
  }

  getVendorById(vendorId: number): Observable<VendorPaymentInterface> {
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    const url = `${localurl}/Vendor/GetVendorById?VendorId=${vendorId}&CompanyId=${companyId}`;
    return this.http.post<VendorPaymentInterface>(url, {});
  }

  insertVendor(vendor: VendorPaymentInterface): Observable<VendorPaymentInterface> {
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    vendor.companyId = companyId;
    const insertUrl = `${localurl}/Vendor/SaveVendor`;
    return this.http.put<VendorPaymentInterface>(insertUrl, vendor);
  }

  updateVendor(vendor: VendorPaymentInterface): Observable<VendorPaymentInterface> {
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    vendor.companyId = companyId;
    const updateUrl = `${localurl}/Vendor/SaveVendor`;
    return this.http.put<VendorPaymentInterface >(updateUrl, vendor);
  }

  deleteVendor(vendorId: number): Observable<void> {
    
    const deleteUrl = `${localurl}/Vendor/DeleteVendorById?VendorId=${vendorId}`;
    return this.http.delete<void>(deleteUrl);
  }
}

