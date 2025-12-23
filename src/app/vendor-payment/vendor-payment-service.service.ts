import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginServiceService } from '../login-page/login-service.service';
import { VendorPaymentInterface, VendorInterface } from '../vendor-payment/vendor-payment-interface';

const localurl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class VendorPaymentServiceService {

  constructor(private http: HttpClient, private loginService: LoginServiceService) { }
 
  getVendorPayment(): Observable<VendorPaymentInterface[]> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${localurl}/AmtTransactions/GetAllTransactions?CompanyId=${companyId}&TypeId=`+ TransactionType.Farmer;
    return this.http.get<VendorPaymentInterface[]>(url, {} );
  }

  getVendorPaymentById(CompanyId: number, TypeId: number, Id: number): Observable<VendorPaymentInterface[]> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${localurl}/AmtTransactions/GetTransactionById?CompanyId=${companyId}&TypeId=${TypeId}&Id=${Id}`;
    return this.http.get<VendorPaymentInterface[]>(url, {} );
  }

  insertVendorPayment(vendor: VendorPaymentInterface): Observable<VendorPaymentInterface> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    vendor.companyId = companyId;
    vendor.createdById = this.loginService?.getUserId() ?? 0;
  


    const insertUrl = `${localurl}/AmtTransactions/SaveTransaction`;
    // Some APIs expect the transaction payload wrapped under a `transaction` key.
    // Wrap the vendor payment object to match that shape so validation keys like
    // 'transaction' and 'vendorName' are present server-side.
    const payload = { transaction: vendor };
    return this.http.post<VendorPaymentInterface>(insertUrl, vendor);
  }

  deleteVendorPayment( transactionId :number, CompanyId:number): Observable<void> {
    const deleteUrl = `${localurl}/AmtTransactions/DeleteTransaction?TransactionId=${transactionId}&CompanyId=${CompanyId}`;
    return this.http.delete<void>(deleteUrl);
  }

  getVendorNameList(): Observable<VendorInterface[]> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${localurl}/Vendor/GetVendorList?CompanyId=${companyId}`;
    return this.http.post<VendorInterface[]>(url, {} );
  }

}
 
enum TransactionType {
  Farmer = '1',
  Customer = '2', 
}