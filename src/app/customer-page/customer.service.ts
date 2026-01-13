import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginServiceService } from '../login-page/login-service.service';

import { environment } from '../../environments/environment';
const localurl = environment.apiUrl;

export interface Customer {
  customerId: number;
  customerName: string;
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
export class CustomerService {

  constructor(private http: HttpClient, private loginService: LoginServiceService) { }

  getCustomers(): Observable<Customer[]> {
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    const apiUrl = `${localurl}/Customer/GetCustomerList?CompanyId=${companyId}`;
    try {
      return this.http.get<Customer[]>(apiUrl);
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }

  }

  getCustomerById(customerId: number): Observable<Customer> {
    const url = `${localurl}/Customer/GetCustomerById?CustomerId=${customerId}`;
    return this.http.post<Customer>(url, {});
  }

  insertCustomer(customer: Customer): Observable<Customer> {

    const insertUrl = `${localurl}/Customer/InsertCustomer`;

    return this.http.post<Customer>(insertUrl, customer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    const UpdateUrl = `${localurl}/Customer/SaveCustomer`;

    return this.http.put<Customer>(UpdateUrl, customer);
  }
  deleteCustomer(customerId: number): Observable<void> {
    const deleteUrl = `${localurl}/Customer/DeleteCustomerById?UserId=${customerId}`;
    return this.http.delete<void>(deleteUrl);
  }
}
