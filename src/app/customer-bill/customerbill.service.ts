import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { LoginServiceService } from '../login-page/login-service.service';
import { Observable } from 'rxjs';
import { SaleAmt, SaleDetails } from './customerbill';



const localurl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class CustomerbillService {
  public companyId: number | null = null;
  public createdById: number | null = null;

  constructor(private http: HttpClient, private loginService: LoginServiceService) { 
     this.companyId = this.loginService?.getCompanyId() ?? 0;
     this.createdById = this.loginService?.getUserId() ?? 0;

  }


  GetCustomerBillDetails(CustomerBillId: number): Observable<any[]> {
    const url = `${localurl}/CustomerBill/GetCustomerBillDetails?CustomerBillId=${CustomerBillId}`;
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


 DeleteCustomerBillDetails(saleDetailsId: number): Observable<any> {
    const url = `${localurl}/CustomerBill/DeleteCustomerBillDetails?SaleDetailsId=${saleDetailsId}`;
    return this.http.delete<any>(url);
  }

  InsertCustomerBill(_saleDetails: SaleDetails, _saleAmt:  SaleAmt,_saledetailslist: SaleDetails[] ): Observable<any> {
    const url = `${localurl}/CustomerBill/InsertCustomerBillDetails`;

  _saleAmt.CompanyId = this.companyId ?? 0;
  _saleDetails.companyId = this.companyId ?? 0;

      // Normalize details: ensure we have an array of SaleDetails
      const detailsArray: SaleDetails[] = Array.isArray(_saledetailslist) && _saledetailslist.length > 0 ? _saledetailslist : (_saleDetails ? [_saleDetails] : []);

      const CustomerBillRequestModel = {
        _SaleAmt: _saleAmt,
       // _SaleDetailslst: detailsArray,
        // include _SaleDetails as array as well to match variations in server models
        _SaleDetails: _saleDetails
      } as any;
 
    
      const maptoserverSalesDetails =  {
        SaleDetailsId: _saleDetails.saleDetailsId,
        CustomerBillId:  _saleDetails.customerBillId,
        CustomerId: _saleDetails.customerId,
        CustomerName: _saleDetails.customerName,
        CustomerBillDate: _saleDetails.customerBillDate,
        ParticularName: _saleDetails.particularName,
        FarmerId: _saleDetails.farmerId,
        Qty: _saleDetails.qty,
        Unit: _saleDetails.unit,
        Weight: _saleDetails.weight,
        Rate: _saleDetails.rate,
        Amt: _saleDetails.amt,
        ComissionPercent: _saleDetails.comissionPercent,
        TaxRate: _saleDetails.taxRate,
        ComissionBillId: _saleDetails.comissionBillId,
        CreatedDate: _saleDetails.createdDate,
        CompanyId: _saleDetails.companyId,
        ComissionAmt: _saleDetails.comissionAmt,
        TaxAmt: _saleDetails.taxAmt,
        CreatedById: this.createdById,
      } ;

const maptoServerSaleAmt = {
        SaleAmtId: _saleAmt.SaleAmtId,
        CustomerBillId: _saleAmt.CustomerBillId,
        ComissionBillId: _saleAmt.ComissionBillId,
        HamaliAmt: _saleAmt.HamaliAmt,
        TotalAmt: _saleAmt.TotalAmt,
        CompanyId: _saleAmt.CompanyId,
        CreatedById: _saleAmt.CreatedById,
        CreatedDate: _saleAmt.CreatedDate
      };

  const payload = {
        requestModel: maptoServerSaleAmt,
        ...maptoserverSalesDetails
      };
   

      const headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' });
      return this.http.post<any>(url, maptoserverSalesDetails, { headers });
  }



  InsertCustomerDetails(_saleDetails: SaleDetails  ): Observable<any> {
    const url = `${localurl}/CustomerBill/InsertCustomerBillDetails`;
 
      const maptoserverSalesDetails =  {
        SaleDetailsId: _saleDetails.saleDetailsId,
        CustomerBillId:  _saleDetails.customerBillId,
        CustomerId: _saleDetails.customerId,
        CustomerName: _saleDetails.customerName,
        CustomerBillDate: _saleDetails.customerBillDate,
        ParticularName: _saleDetails.particularName,
        FarmerId: _saleDetails.farmerId,
        Qty: _saleDetails.qty,
        Unit: _saleDetails.unit,
        Weight: _saleDetails.weight,
        Rate: _saleDetails.rate,
        Amt: _saleDetails.amt,
        ComissionPercent: _saleDetails.comissionPercent,
        TaxRate: _saleDetails.taxRate,
        ComissionBillId: _saleDetails.comissionBillId,
        CreatedDate: _saleDetails.createdDate,
        CompanyId:  this.companyId ?? 0,
        ComissionAmt: _saleDetails.comissionAmt,
        TaxAmt: _saleDetails.taxAmt,
        CreatedById: this.createdById,
      } ;

      const headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' });
      return this.http.post<any>(url, maptoserverSalesDetails, { headers });
  }



}
