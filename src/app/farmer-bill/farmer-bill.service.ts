import { Injectable } from '@angular/core';
import { RuntimeConfigService } from '../runtime-config.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginServiceService } from '../login-page/login-service.service';
import { VendorPaymentInterface, VendorInterface } from '../vendor-payment/vendor-payment-interface';
import { Observable } from 'rxjs';
import { FarmerBillDetailModel, farmerBill } from './farmer-bill-interface';

@Injectable({
  providedIn: 'root'
})
export class FarmerBillService {
  private baseUrl: string = '';

  constructor(private http: HttpClient, private loginService: LoginServiceService, private runtimeConfig: RuntimeConfigService) { 
    this.baseUrl = this.runtimeConfig.get('apiUrl', environment.apiUrl);
  }

  private getListUrl(): string {
    // Try to read company id from login service (sessionStorage). Fallback to 10001 if missing.
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    return `${this.baseUrl}/Vendor/GetVendorList?CompanyId=${companyId}`;
  }

  getVendors(): Observable<VendorInterface[]> {
    const url = this.getListUrl();
    return this.http.post<VendorInterface[]>(url, {});
  }

  GetFarmerBill(ComissionBillId: number): Observable<any[]> {
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    const url = `${this.baseUrl}/FarmerBill/GetFarmerBill?ComissionBillId=${ComissionBillId}&CompanyId=${companyId}`;
    return this.http.get<any[]>(url);
  }

  GetFarmerBillDetails(ComissionBillId: number): Observable<any[]> {
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    const url = `${this.baseUrl}/FarmerBill/GetFarmerBillDetails?ComissionBillId=${ComissionBillId}&CompanyId=${companyId}`;
    return this.http.get<any[]>(url);
  }

  GetNewComissionBillId(): Observable<any[]> {
    const companyId = this.loginService?.getCompanyId() ?? 10001;
    const url = `${this.baseUrl}/FarmerBill/GetNewComissionBillId?CompanyId=${companyId}`;
    return this.http.get<any[]>(url);
  }



  InsertFarmerBillDetails(FarmerBillModel: farmerBill, FarmerBillDetail: FarmerBillDetailModel, FarmerBillExpenses?: Array<{ label: string; value: number }>): Observable<number> {
   
    const url = `${this.baseUrl}/FarmerBill/InsertFarmerBillDetails`;

    const companyId = this.loginService?.getCompanyId() ?? 0;
    // ensure companyId is assigned on the model sent to the API
    FarmerBillModel.companyId = companyId;
    // Map camelCase client model to PascalCase server model expected by .NET
    const mapFarmerBillToServer = (fb: farmerBill) => ({
      FarmerBillId: fb?.farmerBillId ?? 0,
      ComissionBillId: fb?.comissionBillId ?? 0,
      VendorId: fb?.vendorId ?? 0,
      VendorName: (fb as any)?.vendorName ?? '',
      ParticularName: (fb as any)?.particularName ?? '',
      CompanyId: fb?.companyId ?? companyId,
      CreatedById: fb?.createdById ?? 0,
      CreatedDate: fb?.createdDate ? (fb.createdDate instanceof Date ? fb.createdDate.toISOString() : fb.createdDate) : null,
      UpdatedById: (fb as any)?.updatedById ?? 0,
      UpdatedDate: (fb as any)?.updatedDate ? ((fb as any).updatedDate instanceof Date ? (fb as any).updatedDate.toISOString() : (fb as any).updatedDate) : null,
      BillDate: fb?.billDate ? (fb.billDate instanceof Date ? fb.billDate.toISOString() : fb.billDate) : null,
      IsActive: !!fb?.isActive
    });

    const mapDetailToServer = (d: FarmerBillDetailModel) => ({
      FarmerBillDetailId: d?.farmerBillDetailId ?? 0,
      ComissionBillId: d?.ComissionBillId ?? 0,
      ParticularName: (d?.particularName ?? '').toString(),
      Amt: Number(d?.amt ?? 0),
      Qty: Number(d?.qty ?? 0),
      Unit: (d?.unit ?? '').toString(),
      Rate: Number(d?.rate ?? 0),
      Weight: Number(d?.weight ?? 0),
      ComissionPercent: Number(d?.comissionPercent ?? 0),
      CompanyId: d?.companyId ?? companyId,

    });

    //const detailsArray: FarmerBillDetailModel[] = Array.isArray(FarmerBillDetail) ? FarmerBillDetail : [FarmerBillDetail as FarmerBillDetailModel];
    // const serverDetails = detailsArray.map(mapDetailToServer);

    // send the FarmerBillModel object directly in the request body so the controller
    // parameter `FarmerBillModel FarmerBill` can bind it. Use mapped PascalCase object.
    const serverFarmerBill = mapFarmerBillToServer(FarmerBillModel);
    const serverFarmerBillDetails = mapDetailToServer(FarmerBillDetail);

    // Map expenses (client sidebar items) to server model FarmerBillExpensesModel
    const serverExpenses = (FarmerBillExpenses || []).map(e => ({
      CompanyId: FarmerBillModel.companyId ?? companyId,
      FarmerBillId: FarmerBillModel.farmerBillId ?? 0,
      ComissionBillId: FarmerBillModel.comissionBillId ?? 0,
      Amt: Number(e.value) || 0,
      Name: (e.label || '').toString()
    }));

    // Build the FarmerBillRequestModel object as the request body so ASP.NET [FromBody]
    // parameter can bind directly to it. Property names must match the server model.
    const payload = {
      FarmerBill: serverFarmerBill,
      FarmerBillExpenses: serverExpenses,
      FarmerBillDetail: serverFarmerBillDetails
    };

    console.log('Inserting Farmer Bill with payload:', JSON.stringify(payload, null, 2));
    // set explicit JSON content-type header and expect JSON response
    const headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' });
    return this.http.post<number>(url, payload, { headers, responseType: 'json' as const });
  }


  InsertFarmerBill(FarmerBillModel: farmerBill, FarmerBillDetail: FarmerBillDetailModel, FarmerBillExpenses?: Array<{ label: string; value: number }>): Observable<number> {
   
    const url = `${this.baseUrl}/FarmerBill/InsertFarmerBill`;

    const companyId = this.loginService?.getCompanyId() ?? 0;
    // ensure companyId is assigned on the model sent to the API
    FarmerBillModel.companyId = companyId;
    // Map camelCase client model to PascalCase server model expected by .NET
    const mapFarmerBillToServer = (fb: farmerBill) => ({
      FarmerBillId: fb?.farmerBillId ?? 0,
      ComissionBillId: fb?.comissionBillId ?? 0,
      VendorId: fb?.vendorId ?? 0,
      VendorName: (fb as any)?.vendorName ?? '',
      ParticularName: (fb as any)?.particularName ?? '',
      CompanyId: fb?.companyId ?? companyId,
      CreatedById: fb?.createdById ?? 0,
      CreatedDate: fb?.createdDate ? (fb.createdDate instanceof Date ? fb.createdDate.toISOString() : fb.createdDate) : null,
      UpdatedById: (fb as any)?.updatedById ?? 0,
      UpdatedDate: (fb as any)?.updatedDate ? ((fb as any).updatedDate instanceof Date ? (fb as any).updatedDate.toISOString() : (fb as any).updatedDate) : null,
      BillDate: fb?.billDate ? (fb.billDate instanceof Date ? fb.billDate.toISOString() : fb.billDate) : null,
      IsActive: !!fb?.isActive
    });

    const mapDetailToServer = (d: FarmerBillDetailModel) => ({
      FarmerBillDetailId: d?.farmerBillDetailId ?? 0,
      ComissionBillId: d?.ComissionBillId ?? 0,
      ParticularName: (d?.particularName ?? '').toString(),
      Amt: Number(d?.amt ?? 0),
      Qty: Number(d?.qty ?? 0),
      Unit: (d?.unit ?? '').toString(),
      Rate: Number(d?.rate ?? 0),
      Weight: Number(d?.weight ?? 0),
      ComissionPercent: Number(d?.comissionPercent ?? 0),
      CompanyId: d?.companyId ?? companyId,

    });

    const serverFarmerBill = mapFarmerBillToServer(FarmerBillModel);
    const serverFarmerBillDetails = mapDetailToServer(FarmerBillDetail);

    // Map expenses (client sidebar items) to server model FarmerBillExpensesModel
    const serverExpenses = (FarmerBillExpenses || []).map(e => ({
      CompanyId: FarmerBillModel.companyId ?? companyId,
      FarmerBillId: FarmerBillModel.farmerBillId ?? 0,
      ComissionBillId: FarmerBillModel.comissionBillId ?? 0,
      Amt: Number(e.value) || 0,
      Name: (e.label || '').toString()
    }));

    // Build the FarmerBillRequestModel object as the request body so ASP.NET [FromBody]
    // parameter can bind directly to it. Property names must match the server model.
    const payload = {
      FarmerBill: serverFarmerBill,
      FarmerBillExpenses: serverExpenses,
      //FarmerBillDetail: serverFarmerBillDetails
    };

    console.log('Inserting Farmer Bill with payload:', JSON.stringify(payload, null, 2));
    // set explicit JSON content-type header and expect JSON response
    const headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' });
    return this.http.post<number>(url, payload, { headers, responseType: 'json' as const });
  }

  
  delete(farmerBillDetailId: number): Observable<any> {
    const url = `${this.baseUrl}/FarmerBill/DeleteFarmerBillDetails?farmerBillDetailId=${farmerBillDetailId}`;
    return this.http.delete<any>(url, {});
  }


 
  getFarmerBillDateList(FarmerBillModel: farmerBill): Observable<any[]> {
    const companyId = this.loginService?.getCompanyId() ?? 0;

     FarmerBillModel.companyId = companyId;
    // Map camelCase client model to PascalCase server model expected by .NET
    const mapFarmerBillToServer = (fb: farmerBill) => ({
      FarmerBillId: fb?.farmerBillId ?? 0,
      ComissionBillId: fb?.comissionBillId ?? 0,
      VendorId: fb?.vendorId ?? 0,
      VendorName: (fb as any)?.vendorName ?? '',
      ParticularName: (fb as any)?.particularName ?? '',
      CompanyId:   companyId,
      CreatedById: fb?.createdById ?? 0,
      CreatedDate: fb?.createdDate ? (fb.createdDate instanceof Date ? fb.createdDate.toISOString() : fb.createdDate) : null,
      UpdatedById: (fb as any)?.updatedById ?? 0,
      UpdatedDate: (fb as any)?.updatedDate ? ((fb as any).updatedDate instanceof Date ? (fb as any).updatedDate.toISOString() : (fb as any).updatedDate) : null,
      BillDate: fb?.billDate ? (fb.billDate instanceof Date ? fb.billDate.toISOString() : fb.billDate) : null,
      IsActive: !!fb?.isActive
    });


    const apiUrl = `${this.baseUrl}/FarmerBill/GetDDLFarmerValues?FarmerBillModel=${ mapFarmerBillToServer }&CompanyId=${companyId}`;
    try {
      return this.http.post<any[]>(apiUrl,{});
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }

  }



}
