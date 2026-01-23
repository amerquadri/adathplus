import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { RuntimeConfigService } from '../runtime-config.service';
import { LoginServiceService } from '../login-page/login-service.service';
//import { CompanyInterface } from '../common-fields/company-interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  public companyId: number | null = null;
  private baseUrl: string = '';

  constructor(private http:HttpClient, private runtimeConfig: RuntimeConfigService, private loginService: LoginServiceService) {
      this.baseUrl = this.runtimeConfig.get('apiUrl', environment.apiUrl);
    
   }

  public getCompanyList(): Observable<any[]> {
    const apiUrl = `${this.baseUrl}/CompanyMaster`;
     try{
      return this.http.get<any[]>(apiUrl);
     }catch(error){
      console.error('Error fetching companies:', error);
      throw error;
     }
  } 

  /**
   * Save the default company for the currently logged-in user.
   * Mirrors the original jQuery `_SaveDefaultCompany` behaviour.
   */
  public saveDefaultCompany(companyId: number): Observable<any> {
    const url = `${this.baseUrl}/UserMaster/InsertOrUpdateUserById`;

    const userId = this.loginService.getUserId() ?? 0;
    const token = this.loginService.getToken() ?? '';

    const payload = {
      UserId: userId,
      UserName: '',
      UserFullName: '',
      Password: '',
      Email: '',
      Mobile: '',
      Status: 0,
      IsAdmin: false,
      RoleId: 0,
      Designation: '',
      CreatedById: 0,
      IsActive: 0,
      CompanyId: companyId,
      CompanyName: ''
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    return this.http.put(url, payload, { headers }).pipe(
      catchError(err => {
        console.error('Error saving default company', err);
        return throwError(() => err);
      })
    );
  }
}


