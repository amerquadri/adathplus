import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginServiceService } from '../login-page/login-service.service';
import { VendorPaymentInterface,VendorInterface } from '../vendor-payment/vendor-payment-interface';
import { Observable } from 'rxjs';
import { FarmerBillDetailModel,farmerBill } from './farmer-bill-interface';

const localurl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class FarmerBillService {

  constructor(private http: HttpClient, private loginService: LoginServiceService) { }

  private getListUrl(): string {
    // Try to read company id from login service (sessionStorage). Fallback to 10001 if missing.
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    return `${localurl}/Vendor/GetVendorList?CompanyId=${companyId}`;
  }

  getVendors(): Observable<VendorInterface[]> {
    const url = this.getListUrl();
    return this.http.post<VendorInterface[]>(url, {});
  }

  InsertFarmerBillDetails(farmerBill: farmerBill[] | farmerBill, farmerBillDetail: FarmerBillDetailModel[] | FarmerBillDetailModel): Observable<any> {
    const url = `${localurl}/FarmerBill/InsertFarmerBillDetails`;
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    if (Array.isArray(farmerBill)) {
      farmerBill.forEach(fb => fb.companyId = companyId);
    } else {
      farmerBill.companyId = companyId;
    }
    const payload = { farmerBill, farmerBillDetail };
    return this.http.post<any>(url, payload);

  } 

/*
 $.ajax({
     url: _webApiUrl + '/FarmerBill/InsertFarmerBillDetails', // Use the global variable
     type: "POST", // Request type
     //data: JSON.stringify(farmerBillDetail), // Data to be sent
     data: JSON.stringify({ farmerBill: _farmerBill, farmerBillDetail: _farmerBillDetail }), // Data to be sent

     contentType: "application/json;charset=utf-8",
     dataType: "json",
     success: function (data) {
         console.log('Farmer Bill Detail inserted:', data);
         $('#FarmerBillId').val(data);
         _LoadFarmerBillDetails($('#ComissionBillId').val(), _CompanyId);
         GrandTotal();
     },
     error: function (xhr, status, error) {
         console.error("Error inserting farmer bill detail: ", status, error);
     }
 });

*/
}
