import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../runtime-config.service';
import { environment } from '../../environments/environment';
import { LoginServiceService } from '../login-page/login-service.service';
import { VendorPaymentInterface, VendorInterface } from '../vendor-payment/vendor-payment-interface';

@Injectable({
  providedIn: 'root'
})
export class VendorPaymentServiceService {
  private baseUrl: string = '';

  constructor(private http: HttpClient, private loginService: LoginServiceService, private runtimeConfig: RuntimeConfigService) {
    this.baseUrl = this.runtimeConfig.get('apiUrl', environment.apiUrl);
  }
 
  getVendorPayment(): Observable<VendorPaymentInterface[]> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${this.baseUrl}/AmtTransactions/GetAllTransactions?CompanyId=${companyId}&TypeId=`+ TransactionType.Farmer;
    return this.http.get<VendorPaymentInterface[]>(url, {} );
  }

  getVendorPaymentById(CompanyId: number, TypeId: number, Id: number): Observable<VendorPaymentInterface[]> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${this.baseUrl}/AmtTransactions/GetTransactionById?CompanyId=${companyId}&TypeId=${TypeId}&Id=${Id}`;
    return this.http.get<VendorPaymentInterface[]>(url, {} );
  }

  insertVendorPayment(vendor: VendorPaymentInterface): Observable<VendorPaymentInterface> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    vendor.companyId = companyId;
    vendor.createdById = this.loginService?.getUserId() ?? 0;

    const insertUrl = `${this.baseUrl}/AmtTransactions/SaveTransaction`;
    //const payload = { transaction: vendor };
    return this.http.post<VendorPaymentInterface>(insertUrl, vendor);
  }

  deleteVendorPayment( transactionId :number, CompanyId:number): Observable<void> {
    const deleteUrl = `${this.baseUrl}/AmtTransactions/DeleteTransaction?TransactionId=${transactionId}&CompanyId=${CompanyId}`;
    return this.http.delete<void>(deleteUrl);
  }

  getVendorNameList(): Observable<VendorInterface[]> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${this.baseUrl}/Vendor/GetVendorList?CompanyId=${companyId}`;
    return this.http.post<VendorInterface[]>(url, {} );
  }

}
 
enum TransactionType {
  Farmer = '1',
  Customer = '2', 
}