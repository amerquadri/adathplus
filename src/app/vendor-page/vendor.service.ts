import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginServiceService } from '../login-page/login-service.service';

const localurl = environment.apiUrl;

export interface Vendor {
    
  vendorId: number;
  vendorName: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  detail: string;
  credit: number;
  debit: number;
  openingAmt: number;
  createdById: number;
  createdDate: string;
  updatedById: number;
  updatedDate: string;
  isActive: boolean;
  companyId: number;
}
 

@Injectable({ providedIn: 'root' })
export class VendorService {
  constructor(private http: HttpClient, private loginService: LoginServiceService) {}

  private getListUrl(): string {
    // Try to read company id from login service (sessionStorage). Fallback to 10001 if missing.
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    return `${localurl}/Vendor/GetVendorList?CompanyId=${companyId}`;
  }

  getVendors(): Observable<Vendor[]> {
    const url = this.getListUrl();
    return this.http.post<Vendor[]>(url, {} );
  }

  getVendorById(vendorId: number): Observable<Vendor> {
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    const url = `${localurl}/Vendor/GetVendorById?VendorId=${vendorId}&CompanyId=${companyId}`;
    return this.http.post<Vendor>(url, {});
  }

  insertVendor(vendor: Vendor): Observable<Vendor> {
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    vendor.companyId = companyId;
    const insertUrl = `${localurl}/Vendor/SaveVendor`;
    return this.http.put<Vendor>(insertUrl, vendor);
  }

  updateVendor(vendor: Vendor): Observable<Vendor> {
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    vendor.companyId = companyId;
    const updateUrl = `${localurl}/Vendor/SaveVendor`;
    return this.http.put<Vendor>(updateUrl, vendor);
  }

  deleteVendor(vendorId: number): Observable<void> {
    
    const deleteUrl = `${localurl}/Vendor/DeleteVendorById?VendorId=${vendorId}`;
    return this.http.delete<void>(deleteUrl);
  }
}

