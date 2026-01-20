import { Injectable } from '@angular/core';
import { RuntimeConfigService } from '../runtime-config.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginServiceService } from '../login-page/login-service.service';
import { Observable } from 'rxjs';
import { Classlistofvalues } from './classlistofvalues';

@Injectable({
  providedIn: 'root'
})
export class ListofValuesService {
  private baseUrl: string = '';

  constructor(private http: HttpClient, private loginService: LoginServiceService, private runtimeConfig: RuntimeConfigService) {
    this.baseUrl = this.runtimeConfig.get('apiUrl', environment.apiUrl);
  }
 

  getListOfValues(): Observable<Classlistofvalues[]> {  
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${this.baseUrl}/ListOfValues/GetListOfValues?CompanyId=${companyId}`;
    return this.http.post<Classlistofvalues[]>(url, {});
  }

  createListOfValue(payload: Classlistofvalues): Observable<Classlistofvalues> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    payload.CompanyId = companyId;
    const url = `${this.baseUrl}/ListOfValues/CreateListOfValue`;
    return this.http.post<Classlistofvalues>(url, payload || {});
  }

  insertListOfValue(payload: Classlistofvalues): Observable<Classlistofvalues> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    payload.CompanyId = companyId;
    const url = `${this.baseUrl}/ListOfValues/Insert`;
    return this.http.post<Classlistofvalues>(url, payload || {});
  }

  updateListOfValue(payload: Classlistofvalues): Observable<Classlistofvalues> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    payload.CompanyId = companyId;
    const url = `${this.baseUrl}/ListOfValues/Update`;
    return this.http.post<Classlistofvalues>(url, payload || {});
  }

  deleteListOfValue(valuesId: number): Observable<any> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${this.baseUrl}/ListOfValues/Delete?CompanyId=${companyId}&ValuesId=${valuesId}`;
    return this.http.post<any>(url, {});
  }

}
