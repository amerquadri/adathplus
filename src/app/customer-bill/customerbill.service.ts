import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginServiceService } from '../login-page/login-service.service';
import { Observable } from 'rxjs';
import { SaleDetails } from './customerbill';



const localurl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class CustomerbillService {

  constructor(private http: HttpClient, private loginService: LoginServiceService) { }


  GetCustomerBillDetails(CustomerBillId: number): Observable<any[]> {
    const url = `${localurl}/FarmerBill/GetFarmerBillDetails?CustomerBillId=${CustomerBillId}`;
    return this.http.get<any[]>(url);
  }

  
    getCustomersNameList(): Observable<any[]> {
      const companyId = this.loginService?.getCompanyId() ?? 0;
      const apiUrl = `${localurl}/Customer/GetCustomerList?CompanyId=${companyId}`;
      try {
        return this.http.get<any[]>(apiUrl);
      } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
  
    }



}
