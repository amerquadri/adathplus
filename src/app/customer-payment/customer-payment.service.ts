import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../runtime-config.service';
import { environment } from '../../environments/environment';
import { LoginServiceService } from '../login-page/login-service.service';
import { CustomerInterface,CustomerPaymentInterface }  from  '../customer-payment/customer-payment';



@Injectable({
  providedIn: 'root'
})
export class CustomerPaymentService {
  private baseUrl = '';

  constructor(private http: HttpClient, private loginService: LoginServiceService, private runtimeConfig: RuntimeConfigService) {
    this.baseUrl = this.runtimeConfig.get('apiUrl', environment.apiUrl);
  }
 
  getCustomerPayment(): Observable<CustomerPaymentInterface[]> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${this.baseUrl}/AmtTransactions/GetAllTransactions?CompanyId=${companyId}&TypeId=`+ TransactionType.Customer;
    return this.http.get<CustomerPaymentInterface[]>(url, {} );
  }

  getCustomerPaymentById(CompanyId: number, TypeId: number, Id: number): Observable<CustomerPaymentInterface[]> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${this.baseUrl}/AmtTransactions/GetTransactionById?CompanyId=${companyId}&TypeId=${TransactionType.Customer}&Id=${Id}`;
    return this.http.get<CustomerPaymentInterface[]>(url, {} );
  }

  insertCustomerPayment(customer: CustomerPaymentInterface): Observable<CustomerPaymentInterface> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    customer.companyId = companyId;
    customer.createdById = this.loginService?.getUserId() ?? 0;
    const insertUrl = `${this.baseUrl}/AmtTransactions/SaveTransaction`; 
    const payload = { transaction: customer };
    return this.http.post<CustomerPaymentInterface>(insertUrl, customer);
  }

  deleteCustomerPayment( transactionId :number, CompanyId:number): Observable<void> {
    const deleteUrl = `${this.baseUrl}/AmtTransactions/DeleteTransaction?TransactionId=${transactionId}&CompanyId=${CompanyId}`;
    return this.http.delete<void>(deleteUrl);
  }

  getCustomerNameList(): Observable<CustomerInterface[]> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${this.baseUrl}/Customer/GetCustomerNameList?CompanyId=${companyId}`;
    return this.http.get<CustomerInterface[]>(url, {} );
  }

}
 
enum TransactionType {
  Farmer = '1',
  Customer = '2', 
}