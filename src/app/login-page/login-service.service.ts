import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RuntimeConfigService } from '../runtime-config.service';
import { environment } from '../../environments/environment';

export interface LoginResponseItem {
  success?: boolean;
  message?: string;
  companyId?: number;
  companyName?: string;
  createdById?: number;
  createdDate?: string;
  designation?: string;
  email?: string;
  financialYearId?: number;
  isActive?: number;
  isAdmin?: boolean;
  mobile?: string;
  password?: string;
  roleId?: number;
  status?: number;
  token?: string;
  updatedById?: number;
  updatedDate?: string;
  userFullName?: string;
  userId?: number;
  userName?: string;
}

export type LoginResponse = LoginResponseItem[];

export interface LoginResult {
  success: boolean;
  message: string;
  companyId: number;
  companyName: string;
  createdById: number;
  createdDate: string; // ISO 8601 date string (e.g. "0001-01-01T00:00:00")
  designation: string;
  email: string;
  financialYearId: number;
  isActive: number; // using 0/1 as in the example; change to boolean if needed
  isAdmin: boolean;
  mobile: string;
  password: string;
  roleId: number;
  status: number;
  token: string;
  updatedById: number;
  updatedDate: string; // ISO 8601 date string
  userFullName: string;
  userId: number;
  userName: string;

  
}

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private apiUrl = '';

  constructor(private http: HttpClient, private runtimeConfig: RuntimeConfigService) {
    this.apiUrl = this.runtimeConfig.get('apiUrl', environment.apiUrl);
  }
 
  login(username: string, password: string): Observable<LoginResult> {
    const loginUrl = `${this.apiUrl}/UserMaster/login`;
    
    return this.http.post<LoginResponse>(loginUrl, { userName: username, password: password }).pipe(
      map((response: LoginResponse) => {
        console.log('API Response:', response);
        
        // Extract first item from array response
        const responseData = response && response.length > 0 ? response[0] : null;

        if (responseData && responseData.token) {
          // Store token and user data in session storage (only in browser)
          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.setItem('authToken', responseData.token);
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('loginTime', new Date().toISOString());
            sessionStorage.setItem('userId', responseData.userId?.toString() || '');
            sessionStorage.setItem('userFullName', responseData.userFullName || '');
            sessionStorage.setItem('companyId', responseData.companyId?.toString() || '');
            sessionStorage.setItem('roleId', responseData.roleId?.toString() || '');
            sessionStorage.setItem('companyName', responseData.companyName || '');
          }

          return {
            success: true,
            message: responseData.message || 'Login successful',
            companyId: responseData.companyId || 0,
            companyName: responseData.companyName || '',
            createdById: responseData.createdById || 0,
            createdDate: responseData.createdDate || '',
            designation: responseData.designation || '',
            email: responseData.email || '',
            financialYearId: responseData.financialYearId || 0,
            isActive: responseData.isActive || 0,
            isAdmin: responseData.isAdmin || false,
            mobile: responseData.mobile || '',
            password: responseData.password || '',
            roleId: responseData.roleId || 0,
            status: responseData.status || 0,
            token: responseData.token,
            updatedById: responseData.updatedById || 0,
            updatedDate: responseData.updatedDate || '',
            userFullName: responseData.userFullName || '',
            userId: responseData.userId || 0,
            userName: responseData.userName || username
          };
        } else {
          return {
            success: false,
            message: responseData?.message || 'Login failed',
            companyId: 0,
            companyName: '',
            createdById: 0,
            createdDate: '',
            designation: '',
            email: '',
            financialYearId: 0,
            isActive: 0,
            isAdmin: false,
            mobile: '',
            password: '',
            roleId: 0,
            status: 0,
            token: '',
            updatedById: 0,
            updatedDate: '',
            userFullName: '',
            userId: 0,
            userName: ''
          };
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        
        // Handle different error scenarios
        let errorMessage = 'Wrong username and password';
        
        if (error.status === 401) {
          errorMessage = 'Wrong username and password';
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to server';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later';
        }
        
        return throwError(() => ({
          success: false,
          message: errorMessage,
          companyId: 0,
          companyName: '',
          createdById: 0,
          createdDate: '',
          designation: '',
          email: '',
          financialYearId: 0,
          isActive: 0,
          isAdmin: false,
          mobile: '',
          password: '',
          roleId: 0,
          status: 0,
          token: '',
          updatedById: 0,
          updatedDate: '',
          userFullName: '',
          userId: 0,
          userName: ''
        }));
      })
    );
  }

  /**
   * Get stored token from session storage
   * @returns string | null
   */
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Get stored username from session storage
   * @returns string | null
   */
  getUsername(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('username');
    }
    return null;
  }

  /**
   * Get stored user ID from session storage
   * @returns number | null
   */
  getUserId(): number | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const userId = sessionStorage.getItem('userId');
      return userId ? parseInt(userId, 10) : null;
    }
    return null;
  }

  /**
   * Get stored user full name from session storage
   * @returns string | null
   */
  getUserFullName(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('userFullName');
    }
    return null;
  }

  /**
   * Get stored company ID from session storage
   * @returns number | null
   */
  public getCompanyId(): number | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const companyId = sessionStorage.getItem('companyId');
      return companyId ? parseInt(companyId, 10) : null;

    }
    return null;
  }


  public getCompanyName(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const companyName = sessionStorage.getItem('companyName');
      return  companyName ? companyName : null;

    }
    return null;
  }
  /**
   * Get stored role ID from session storage
   * @returns number | null
   */
  getRoleId(): number | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const roleId = sessionStorage.getItem('roleId');
      return roleId ? parseInt(roleId, 10) : null;
    }
    return null;
  }

  /**
   * Check if user is logged in
   * @returns boolean
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Logout function - clears session storage
   */
  logout(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('loginTime');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userFullName');
      sessionStorage.removeItem('companyId');
      sessionStorage.removeItem('roleId');
      sessionStorage.removeItem('companyName');

    }
  }

  /**
   * Get login time from session storage
   * @returns Date | null
   */
  getLoginTime(): Date | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const loginTime = sessionStorage.getItem('loginTime');
      return loginTime ? new Date(loginTime) : null;
    }
    return null;
  }
}
