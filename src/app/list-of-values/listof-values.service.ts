import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginServiceService } from '../login-page/login-service.service';
import { Observable } from 'rxjs';
import { Classlistofvalues } from './classlistofvalues';

const localurl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ListofValuesService {


  constructor(private http: HttpClient, private loginService: LoginServiceService) { }
 

  getListOfValues(): Observable<Classlistofvalues[]> {  
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${localurl}/ListOfValues/GetListOfValues?CompanyId=${companyId}`;
    return this.http.post<Classlistofvalues[]>(url, {});
  }

  createListOfValue(payload: Classlistofvalues): Observable<Classlistofvalues> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    payload.CompanyId = companyId;
    const url = `${localurl}/ListOfValues/CreateListOfValue`;
    return this.http.post<Classlistofvalues>(url, payload || {});
  }

  insertListOfValue(payload: Classlistofvalues): Observable<Classlistofvalues> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    payload.CompanyId = companyId;
    const url = `${localurl}/ListOfValues/Insert`;
    return this.http.post<Classlistofvalues>(url, payload || {});
  }

  updateListOfValue(payload: Classlistofvalues): Observable<Classlistofvalues> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    payload.CompanyId = companyId;
    const url = `${localurl}/ListOfValues/Update`;
    return this.http.post<Classlistofvalues>(url, payload || {});
  }

  deleteListOfValue(valuesId: number): Observable<any> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${localurl}/ListOfValues/Delete?CompanyId=${companyId}&ValuesId=${valuesId}`;
    return this.http.post<any>(url, {});
  }

}
