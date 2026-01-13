import { get } from "https";

export interface SaleAmt {

    SaleAmtId: number;
    CustomerBillId: number;
    ComissionBillId: number;
    HamaliAmt: number;
    TotalAmt: number;
    CompanyId: number;
    CreatedById: number;
    CreatedDate: Date;

}


export interface SaleDetails {

    SaleDetailsId: number;
    CustomerBillId: number;
    CustomerId: number;
    CustomerName: string;
    CustomerBillDate: Date;
    ParticularName: string;
    FarmerId: number;
    Qty: number;
    Unit: string;
    Weight: number;
    Rate: number;
    Amt: number;
    ComissionPercent: number;
    TaxRate: number;
    ComissionBillId: number;
    CreatedById: number;
    CreatedDate: Date;
    CompanyId: number;
    ComissionAmt: number;
    TaxAmt: number;

}

