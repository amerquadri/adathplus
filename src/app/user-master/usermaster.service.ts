import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginServiceService } from '../login-page/login-service.service';
import { RuntimeConfigService } from '../runtime-config.service';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserMaster } from './user-master.interface';

@Injectable({ providedIn: 'root' })
export class UsermasterService {
  private baseUrl: string = '';

  constructor(private http: HttpClient, private loginService: LoginServiceService, private runtimeConfig: RuntimeConfigService) {
    this.baseUrl = this.runtimeConfig.get('apiUrl', environment.apiUrl);
  }

  GetUserList(): Observable<UserMaster[]> {
    const userId = this.loginService.getUserId() ?? 0;
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const token = this.loginService.getToken() ?? '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    const url = `${this.baseUrl}/UserMaster/GetUserList`;
    return this.http.get<UserMaster[]>(url, { headers });
  }

  getUserById(userId: number): Observable<UserMaster> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    const url = `${this.baseUrl}/UserMaster/GetUserById?UserId=${userId}`;
    return this.http.post<UserMaster>(url, {});
  }

  insertUser(user: UserMaster): Observable<UserMaster> {
    const companyId = this.loginService?.getCompanyId() ?? 0;
    user.companyId = companyId;
    const token = this.loginService.getToken() ?? '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    const insertUrl = `${this.baseUrl}/UserMaster/InsertOrUpdateUserById`;
    return this.http.put<UserMaster>(insertUrl, user, { headers });
  }

  updateUser(user: UserMaster): Observable<UserMaster> {
    user.companyId = this.loginService?.getCompanyId() ?? 0;
    const token = this.loginService.getToken() ?? '';

     const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    const insertUrl = `${this.baseUrl}/UserMaster/InsertOrUpdateUserById`;
    return this.http.put<UserMaster>(insertUrl, user, { headers });
  }

  deleteByUserId(userId: number): Observable<void> {
    const token = this.loginService.getToken() ?? '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    const deleteUrl = `${this.baseUrl}/UserMaster/DeleteByUserId?UserId=${userId}`;
    // Debug logging to see what is being sent
    console.log('[UsermasterService] deleteByUserId ->', { deleteUrl, token, headersObj: { Authorization: headers.get('Authorization') } });

    // Observe full response for debugging and map to void for callers
    return this.http.delete<void>(deleteUrl, { headers, observe: 'response' as 'response' }).pipe(
      tap(resp => console.log('[UsermasterService] delete response', resp.status, resp)),
      map(() => undefined),
      catchError(err => {
        console.error('[UsermasterService] delete error', err);
        return throwError(() => err);
      })
    );
  }


}
